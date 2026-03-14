# Spec: Dashboard — RU Card Only Payment Flow

## Goal
Simplify the payment flow in `Dashboard.tsx` to support only RU card via Tinkoff.
Remove the multi-payment-link display, replace with direct redirect to single payment URL.

## Current state
- Modal shows tariff selector (1/3 months)
- Calls `/api/users/create_payment` → gets `payment_links: [{payment_link, payment_text}]`
- Displays all links as buttons

## New API contract
Backend now returns:
```json
{
  "payment_link": "https://securepay.tinkoff.ru/...",
  "payment_id": 123456789,
  "order_id": "..."
}
```

## Changes required in `Dashboard.tsx`

### 1. Update `PaymentResponse` interface
```typescript
interface PaymentResponse {
  payment_link: string;
  payment_id: number;
  order_id: string;
}
```

Remove `PaymentLink` interface entirely.

### 2. Update state
```typescript
const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
```
Remove `paymentLinks` state.

### 3. Update `handleRenewal`
After success:
- Set `paymentUrl` from `data.payment_link`
- Immediately open in new tab: `window.open(data.payment_link, '_blank', 'noopener,noreferrer')`
- Close modal

```typescript
const handleRenewal = async () => {
  setIsLoading(true);
  try {
    const response = await fetch('/api/users/create_payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      },
      body: JSON.stringify({ tariff: parseInt(selectedMonths) }),
    });

    if (!response.ok) throw new Error('Failed to create payment');

    const data: PaymentResponse = await response.json();
    window.open(data.payment_link, '_blank', 'noopener,noreferrer');
    handleCloseModal();
  } catch (error) {
    toast({
      title: 'Ошибка',
      description: 'Не удалось создать платеж',
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
  } finally {
    setIsLoading(false);
  }
};
```

### 4. Modal body simplification
Remove the `paymentLinks.length > 0` branch entirely.
Keep only: tariff selector cards + "Создать платеж" button.

### 5. Add 5-month option
Add third tariff card (alongside 1 and 3 months):
```tsx
<Card onClick={() => setSelectedMonths('5')} ...>
  <CardBody>
    <VStack spacing={2}>
      <Text fontWeight="bold">5 месяцев</Text>
      <Badge colorScheme="green">Выгодно</Badge>
    </VStack>
  </CardBody>
</Card>
```
Switch SimpleGrid from `columns={2}` to `columns={3}`.

### 6. `handleCloseModal` cleanup
```typescript
const handleCloseModal = () => {
  setPaymentUrl(null);
  setSelectedMonths('1');
  onClose();
};
```

## Files to modify
- `susi-network-web/src/pages/Dashboard.tsx`

## Branch
`feature/dashboard-ru-card-flow`

## Notes
- Keep Chakra UI components as-is
- Keep all other Dashboard functionality unchanged (logout, sub_url button, support links)
- No backend changes needed here — just frontend adaptation
