
import RegisterForm from './components/Register';

export const metadata = {
  title: 'Գրանցում | Իմ Կայքը',
  description: 'Ստեղծեք նոր հաշիվ մեր հարթակում',
};

export default function RegisterPage() {
  return (
    <main style={{ padding: '20px' }}>
      <h1>welcome</h1>
      <p>Please fill in the details to register.</p>
      
      <RegisterForm />
    </main>
  );
}
