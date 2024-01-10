import React, { useEffect, useRef, useState } from 'react';

/** less
 * @largestMobileScreen: 700px
 * .top-banner-container {
 *   width: 100%;
 *   display: flex;
 *   justify-content: center;
 *   align-items: center;
 *   font-size: 17px;
 *   line-height: 22px;
 *   min-height: 60px;
 *
 *   .content-container {
 *     margin-top: 19px;
 *     margin-bottom: 19px;
 *     margin-left: 50px;
 *     margin-right: 50px;
 *     text-align: center;
 *     .sbonusux-body-m-regular();
 *
 *     @media only screen and (max-width: @largestMobileScreen) {
 *       margin-left: 34px;
 *       margin-right: 34px;
 *       margin-top: 10px;
 *       margin-bottom: 10px;
 *     }
 *
 *     & > * {
 *       display: inline;
 *     }
 *   }
 *
 *   .top-banner-image {
 *     max-height: 30px;
 *     margin-right: 14px;
 *     vertical-align: text-bottom;
 *   }
 *
 *   pre {
 *     margin: 0;
 *   }
 *
 *   .close-button-wrapper {
 *     position: absolute;
 *     top: 9px;
 *     right: 0;
 *
 *     @media only screen and (min-width: @largestMobileScreen) {
 *       top: 15px;
 *       right: 15px;
 *     }
 *   }
 *
 *   .cancel {
 *     & > svg > path {
 *       fill: var(--top-banner-text-color);
 *     }
 *
 *     @media only screen and (max-width: @largestMobileScreen) {
 *       width: 44px;
 *       height: 44px;
 *
 *       &:hover {
 *         background: initial;
 *       }
 *
 *       &:active {
 *         background: initial;
 *       }
 *     }
 *
 *     @media only screen and (min-width: @largestMobileScreen) {
 *       &:hover {
 *         background: var(--close-btn-hover-background);
 *       }
 *
 *       &:active {
 *         background: var(--close-btn-active-background);
 *       }
 *     }
 *   }
 * }
 *
 */

export interface TopBannerConfig {
  name: string;
  mainContent?: string;
  linkUrl?: string;
  linkText?: string;
  image?: TopBannerImage;
  theme: TopBannerTheme;
  componentId?: string;
}

export interface TopBannerTheme {
  name: string;
  background: string;
  textColor: string;
  closeBtnHoverBackground: string;
  closeBtnActiveBackground: string;
}

export interface TopBannerImage {
  description: string;
  url: string;
}

type WrapperProps = {
  theme: TopBannerTheme;
  linkUrl?: string;
  children: React.ReactElement[];
  setHeight: React.Dispatch<React.SetStateAction<number>>;
  setHeightInView: React.Dispatch<React.SetStateAction<number>>;
};

// laskee bannerin korkeuden ja määrittää värit ja jos banneri on linkki vai ei
const Wrapper = ({
  theme,
  linkUrl,
  children,
  setHeight,
  // setHeightInView turha lähettää tänne myös, koska sille tehdään täysin sama asia kuin setHeightille. setHeightInViewn voisi asettaa parent komponentissa height staten perusteella
  setHeightInView,
}: WrapperProps) => {
  const styles = {
    background: theme.background,
    color: theme.textColor,
  };
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) {
      setHeight(ref.current.clientHeight);
      setHeightInView(ref.current.clientHeight);
    }
    // en ole varma onko sekin ehkä ongelma että tämä useEffect hookki ajetaan vain kerran, jos henkilön näytön koko vaikka muuttuu jostain syystä (kuten Inspect toolilla voi tehdä x))
  }, []);
  return (
    <>
      {linkUrl ? (
        <a
          ref={ref}
          className={'top-banner-container'}
          style={styles}
          href={linkUrl}
        >
          {children}
        </a>
      ) : (
        <div ref={ref} className={'top-banner-container'} style={styles}>
          {children}
        </div>
      )}
    </>
  );
};

// Komponentti joka näyttää "custom" bannerin sivun ylälaidassa ja jonka muuttaa kokoa scrollatessa. Bannerin voi sulkea jolloin se ei näy enää, ellei omaa localstoragea tyhjennä
// Tuntuu että komponentissa jonkin verran turhaa koodia ja propsien lähettelyä, useEffect stateja sais pois ainakin 1, ehkä 2, muita pikku juttuja mitä ihmettelin
const TopBanner: React.FunctionComponent<{ config: TopBannerConfig }> = (
  props
) => {
  // määrittelee että näytetäänkö banneri -> shouldShow() functio tarkistaa localStoragesta jos banneri on dismissattu aiemmin
  const [showBanner, setShowBanner] = useState(false);
  // määrittelee bannerin korkeuden ensimmäisellä rendauskerralla
  const [height, setHeight] = useState<number>(0);
  // määrittelee bannerin korkeuden kun käyttäjä scrollaa
  const [heightInView, setHeightInView] = useState<number>(0);
  console.log('topBanner');
  console.log('height: ', height, 'heightInView: ', heightInView);

  useEffect(() => {
    window.addEventListener('scroll', () => {
      const scrollY = parseInt(
        document.documentElement.style
          .getPropertyValue('--scroll-y')
          .replace('px', ''),
        10
      );
      // tämä laskelma tuntuu vähän oudolta, en ihan ymmärrä miksi heightInView on height - scrollY
      setHeightInView(scrollY < height ? height - scrollY : 0);
    });
    // tätä css variablea ei käytetä missään (top-banner-container classissa)
    document.documentElement.style.setProperty(
      '--top-banner-height-in-view',
      `${heightInView}px`
    );
  }, [height, heightInView]);

  // props.config on pakollinen propsi jota ilman typescriptin avulla komponentti ei muutenkaan toimisi. Eli turha check. (En myös näe syytä miksi configin pitäisi olla erillinen prop, kun TopBannerConfigin voisi laittaa suoraan TopBannerin propseihin mutta varmaan tyyli/maku asia tms)
  // if (!props.config) {
  //   return null;
  // }

  const { name, mainContent, linkUrl, linkText, image, theme } = props.config;
  const hasLink = linkUrl && linkText;
  // mainContent voisi olla pakollinen propsi, olisi selkeämpi kun näköjään kuitenkin pakollisia ja parempia error viestejä jos puuttuvat. !hasLink checkaus tässä täysin turha
  // if (!theme || (!mainContent && !hasLink)) {
  //   console.log('jotain puuttuu');
  //   return null;
  // }


  // ONGELMA: näiden useEffect hookkien pitäisi olla ennen kaikkia return statementteja
  useEffect(() => {
    setShowBanner(shouldShow(name));
    // ehkä vähän hassu tarkistaa "document"in olemassaolo tässä vaiheessa, kun eihän mikään muukaan toimi ilman sitä. Jos pitää tarkistaa niin komponentin alussa?
    if (document) {
      // hakisin banner dokumentin johonkin variableen ja käyttäisin sitä document.documentElementin sijaan
      document.documentElement.style.setProperty(
        '--close-btn-hover-background',
        theme.closeBtnHoverBackground
      );
      document.documentElement.style.setProperty(
        '--close-btn-active-background',
        theme.closeBtnActiveBackground
      );
      document.documentElement.style.setProperty(
        '--top-banner-text-color',
        theme.textColor
      );
    }
    // dependency array puuttuu -> useEffect hookki ajetaan vain kerran. Ei välttämättä ongelma
  }, []);

  useEffect(() => {
    if (!showBanner) {
      // tässä voisi käyttää setHeightInView hookkia, mutta tavallaan koko hookki on turha koska tämä koko komponentti ei palauta mitään (paitsi tyhjän divin) jos showBanner on false
      document.documentElement.style.setProperty(
        '--top-banner-height-in-view',
        '0px'
      );
    }
  }, [showBanner]);

  return (
    // jos banneria ei näytetä, ei tarttisi tyhjää diviäkään renderöidä
    <div>
      {showBanner && (
        <Wrapper
          theme={theme}
          linkUrl={hasLink ? linkUrl : undefined}
          setHeight={setHeight}
          setHeightInView={setHeightInView}
        >
          <div className={'content-container'}>
            {image && (
              <img
                className={'top-banner-image'}
                alt={image.description}
                src={image.url}
              />
            )}
            {/* tässä taas mainContent optional vaikka aiemmin on pakollisuus tsekki */}
            {mainContent && (
              <div className={'top-banner-main-content'}>
                {mainContent} {hasLink ? <u>{linkText}</u> : ''}
              </div>
            )}
          </div>
          <CloseButton
            close={(e) => {
              e.preventDefault();
              dismissBanner(name);
              setShowBanner(false);
              // setHeight ei tässä tee mitään koska height statea on käytetty vaan scrollauksen laskemiseen. setHeightInView voisi olla tässä mieluummin jos jompi kumpi
              setHeight(0);
            }}
          />
        </Wrapper>
      )}
    </div>
  );
};

// nämä apufunctiot voisi laittaa erilliseen tiedostoon, josta ne voisi importata
export const dismissBanner = (name: string) => {
  getStorage('localStorage')?.setItem(`banner-${name}-dismissed`, 'true');
};

const shouldShow = (name: string) => {
  if (!getStorage('localStorage')) {
    return false;
  }

  return !(
    getStorage('localStorage')?.getItem(`banner-${name}-dismissed`) === 'true'
  );
};

type StorageType = 'localStorage' | 'sessionStorage';
function storageAvailable(_type: StorageType): boolean {
  // Property 'browser' does not exist on type 'Process'. -> vissiin pitäisi TypeScriptiä varten erikseen asentaa @types/node
  // muutenkin hassu check. Eikö tässä pitäisi tarkistaa onki _type localStorage tai sessionStorage saatavilla?
  if (process.browser !== true && typeof window !== 'object') {
    return false;
  }
  return true;
}

function getStorage(name: StorageType): Storage {
  if (storageAvailable(name)) {
    return window[name];
  }
  // Type 'null' is not assignable to type 'Storage'. -> eli pitäisi vaan määrittää että return type on Storage | null
  return null;
}

const CloseButton: React.FunctionComponent<{
  close: (event?: React.MouseEvent | MouseEvent) => void;
}> = ({ close }) => {
  return (
    <div className={'close-button-wrapper'}>
      <CancelIcon className="cancel" onClick={(e) => close(e)} />
    </div>
  );
};

const CancelIcon: React.FunctionComponent<{
  // onClick propsin pitäisi olla pakollinen
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
}> = ({ className = 'cancel', onClick }) => (
  <div className={className} onClick={(e) => onClick(e)}>
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.29293 8.00001L0.146484 15.1465L0.853591 15.8536L8.00004 8.70711L15.1465 15.8536L15.8536 15.1465L8.70714 8.00001L15.8536 0.853561L15.1465 0.146454L8.00004 7.2929L0.853591 0.146454L0.146484 0.853561L7.29293 8.00001Z"
        fill="#484848"
      />
    </svg>
  </div>
);

export default TopBanner;

