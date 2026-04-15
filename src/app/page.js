
import RegisterForm from './components/Register';

export const metadata = {
  title: 'Գրանցում | Իմ Կայքը',
  description: 'Ստեղծեք նոր հաշիվ մեր հարթակում',
};

export default function RegisterPage() {
  return (
    <main style={{ padding: '20px' }}>
      <h1>Բարի գալուստ</h1>
      <p>Խնդրում ենք լրացնել տվյալները գրանցվելու համար:</p>
      
      <RegisterForm />
    </main>
  );
}
