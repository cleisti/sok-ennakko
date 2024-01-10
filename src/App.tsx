import { Routes, Route, useMatch } from 'react-router-dom';
import navigationImage from './assets/Navigation.png';
import blogImage from './assets/dfa3347e5ce2af0d84ef363887e328c7.png';
import CTASection from './components/CTASection';
import TopBanner from './top-banner-refactored';

import 'tailwindcss/tailwind.css';
import './styles.css';

const BlogPost = () => {
  return (
    <>
      <div className="blog-heading">
        <h2>Prismasta ostamasi vaate saattaa olla bangladeshilaisen Tania Akterin, 23, ompelema</h2>
        <p className="subheading">
          Praesent dapibus neque id cursus faucibus tortor neque egestas auguae eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi tincidunt quis accumsan porttitor facilisis luctus metus.
        </p>
        <img src={blogImage} className="main-image" alt="blog" />
        <p className='text-sans text-xs'>
          Tania Akter, 23, työskentelee ompelijana bangladeshilaisessa vaatetehtaassa. Osa työntekijöiden tekemistä vaatteista tuodaan myytäväksi S-ryhmän Prismoihin Suomeen.
        </p>
      </div>
      <div className='body-text'>
        <div className='grey-box'>
          <p className='text-bold-green'>Teema | Prisma-muoti</p>
          <p className='text-sans'>
            Myös S-ryhmä hankkii osan myymistään vaatteista Bangladeshista. S-ryhmä selvitti, minkälaiset työolot ovat kahdella sen käyttämällä bangladeshilaisella tehtaalla.
          </p>
        </div>
        <p>
        Vaatetehtaan portilla seisoo jämäkän oloinen vartija. Ennen tehdasalueelle päästämistä mies laittaa kuumemittarin jokaisen työntekijän otsalle. Testi paljastaa, onko joku tulossa kipeänä töihin.<br/><br/>

        Ihmiset astelevat työpaikalleen paikalliseen vaatetehtaaseen koulun parijonoa muistuttavassa muodostelmassa. Hiekka pölisee varvassandaaleissa.<br/><br/>

        Seuraavaksi portista kävelee 23-vuotias ompelija <strong>Tania Akter</strong>. Maata viistävään mekkoon ja pään peittävään huiviin pukeutunut työntekijä läpäisee tarkastuksen moitteetta.<br/><br/>

        Kun portti jää taakse, Akter astuu sisälle toiseen maailmaan. Autojen merkkiäänet, kaupungin savusumu ja työmatkalaisten puheensorina vaihtuvat tehtaan hiljaisuuteen.<br/><br/>

        Työpäivä vaatetehtaassa lähellä Bangladeshin pääkaupunki Dhakaa on alkamassa.<br/><br/>

        Sisällä tehtaassa työläiset riisuvat kenkänsä ja ovat paljain jaloin. Mikään ei paina jalanpohjaa, sillä tilat ovat modernit ja siistit. Siisteydestä muistuttaa roskaamisen kieltävä kyltti.<br/><br/>

        Ompelijat, lankakerien valmistajat ja viimeistelijät tekevät töitä eri osastoilla. Hiljaisuuden rikkoo vaimea naurahdus, joka kuuluu työntekijän kasvomaskin takaa.<br/><br/>

        Dhakan lähellä sijaitsevassa vaatetehtaassa työntekijät, Akter muiden muassa, valmistavat t-paitoja, trikoopuseroita ja collegevaatteita myytäväksi eri puolille maailmaa. Suomeen, S-ryhmän Prismoihin tehtaalta lähtee muun muassa House- ja Ciraf-merkkien, Finlaysonin Arkismin sekä Reino&Ainon vaatteita.
        </p>
      </div>
    </>
  );
};

const Page = () => {
  const match = useMatch('/blog/:id');

  const handleClick = () => {
    alert(`Called for action on blog post "${match?.params.id}"`);
  };

  return (
    <div className="page">
      {match?.params.id === '1' && <TopBanner config={{ componentId: 'top-banner-container', name: 'top-banner', mainContent: 'this is the main content', theme: { name: 'theme', background: 'lightBlue', textColor: 'darkGrey', closeBtnActiveBackground: 'black', closeBtnHoverBackground: 'yellow'}}} />}
      {/* CTA komponentti erikseen sen takia koska se voisi hyvin olla itse blog postista riippumaton elementti, ns "lisä" sivulla. Siksi myös onClick handleri lähetetään parent elementistä (voisi myös tulla muualta dynaamisesti) */}
      <BlogPost />
      <CTASection onClick={handleClick} title='Lorem ipsum dolor sit' text='Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio.' buttonText='Call to action'/>
    </div>
  );
};

const App = () => {
  return (
    <div className='container'>
      <img src={navigationImage} className="banner" alt="logo" />
      <Routes>
        <Route path='/blog/:id' element={<Page />} />
      </Routes>
    </div>
  );
};

export default App;
