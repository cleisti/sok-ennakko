import OpenIcon from '../assets/Open-icon';

interface ButtonProps {
  className: string;
  onClick: () => void;
  buttonText: string;
  icon?: string;
}

// "Yleinen" button komponentti, jota voisi käyttää useassa eri paikassa (toki lisäominaisuuksia pitäisi lisätä)
const Button = ({ className, onClick, buttonText, icon }: ButtonProps) => {

  let iconComponent = null;
  if (icon && icon === 'open') iconComponent = OpenIcon;

  return <button className={className} onClick={onClick}><span>{buttonText}</span>{icon && (<div className='margin-5'>{iconComponent}</div>)}</button>;
};

export default Button;