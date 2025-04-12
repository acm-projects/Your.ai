import React, { useEffect, useState } from "react";

const WeatherWidget: React.FC = () => {
    const [locationId, setLocationId] = useState<string>("");

    useEffect(() => {
        const fetchLocation = async () => {
            try {
                const response = await fetch("https://ipapi.co/json/"); 
                const data = await response.json();
                const approximateLocationId = data.city || ""; 
                setLocationId(approximateLocationId);
            } catch (error) {
                console.error("Failed to fetch location", error);
            }
        };

        fetchLocation();
    }, []);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://www.tomorrow.io/v1/widget/sdk/sdk.bundle.min.js";
        script.async = true;
        script.id = "tomorrow-sdk";

        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <div>
            <div
                className="tomorrow"
                data-location-id={locationId}
                data-language="EN"
                data-unit-system="IMPERIAL"
                data-skin="light"
                data-widget-type="upcoming"
                style={{ paddingBottom: "22px", position: "relative" }}
            >
                <a
                    href="https://www.tomorrow.io/weather-api/"
                    rel="nofollow noopener noreferrer"
                    target="_blank"
                    style={{
                        position: "absolute",
                        bottom: 0,
                        transform: "translateX(-50%)",
                        left: "50%",
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
        </div>
    );
};

export default WeatherWidget;
