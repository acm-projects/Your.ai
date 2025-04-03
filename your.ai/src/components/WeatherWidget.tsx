import React, { useEffect } from 'react';

const WeatherWidget: React.FC = () => {
  useEffect(() => {
    const loadScript = () => {
      if (document.getElementById('tomorrow-sdk')) {
        if ((window as any).__TOMORROW__) {
          (window as any).__TOMORROW__.renderWidget();
        }
        return;
      }

      const script = document.createElement('script');
      script.id = 'tomorrow-sdk';
      script.src = 'https://www.tomorrow.io/v1/widget/sdk/sdk.bundle.min.js';
      script.async = true;
      document.body.appendChild(script);
    };

    // Get user's geolocation
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const widget = document.getElementById('weather-upcoming-widget');
        if (widget) {
          widget.setAttribute('data-location-id', `${latitude},${longitude}`);
        }
        loadScript();
      },
      () => {
        // fallback location: Richardson, TX
        const widget = document.getElementById('weather-upcoming-widget');
        if (widget) {
          widget.setAttribute('data-location-id', '32.9483,-96.7299');
        }
        loadScript();
      }
    );
  }, []);

  return (
    <div
      className="tomorrow"
      id="weather-upcoming-widget"
      data-language="EN"
      data-unit-system="IMPERIAL"
      data-skin="light"
      data-widget-type="upcoming"
      style={{ paddingBottom: '22px', position: 'relative' }}
    >
      <a
        href="https://www.tomorrow.io/weather-api/"
        rel="nofollow noopener noreferrer"
        target="_blank"
        style={{
          position: 'absolute',
          bottom: 0,
          transform: 'translateX(-50%)',
          left: '50%',
        }}
      >
        <img
          alt="Powered by the Tomorrow.io Weather API"
          src="https://weather-website-client.tomorrow.io/img/powered-by.svg"
          width="250"
          height="18"
        />
      </a>
    </div>
  );
};

export default WeatherWidget;
