import Button from './Button';
import CtaIcons from '../assets/Cta-icons';

interface CTASectionProps {
  onClick: () => void;
  title: string;
  text: string;
  buttonText: string;
}

// Yksinkertainen CTA komponentti, joka saa propsina onClick handlerin ja tekstit
// Parannuksena komponentille voisi myös lähettää esim värit ja iconit propsina, jolloin olisi vieläkin monikäyttöisempi
const CTASection = ({ onClick, title, text, buttonText }: CTASectionProps) => {
  return (
    <div className='body-text'>
      <div className='cta-box'>
        {CtaIcons}
        <p className='cta-box-text'>{title}</p>
        <div className='cta-text-padding'>
          <p className='cta-box-text-light'>{text}</p>
        </div>
        <Button onClick={onClick} className='cta-button' icon='open' buttonText={buttonText} />
      </div>
    </div>
  );
};

export default CTASection;