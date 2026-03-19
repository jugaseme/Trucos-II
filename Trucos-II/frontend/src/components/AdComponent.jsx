import { useEffect } from 'react';

const AdComponent = ({ adSlot, adFormat = "auto", fullWidthResponsive = "true" }) => {
    useEffect(() => {
        try {
            // Push an ad initialization only if window.adsbygoogle exists
            // Using a short timeout ensures the ins element is mounted first
            setTimeout(() => {
                ;(window.adsbygoogle = window.adsbygoogle || []).push({});
            }, 100);
        } catch (error) {
            console.error('Error loading Google AdSense', error);
        }
    }, [adSlot]);

    return (
        <div style={{ textAlign: "center", margin: "1rem 0" }}>
            <ins 
                className="adsbygoogle"
                style={{ display: "block" }}
                data-ad-client="ca-pub-9549576765701211"
                data-ad-slot={adSlot}
                data-ad-format={adFormat}
                data-full-width-responsive={fullWidthResponsive}
            />
        </div>
    );
};

export default AdComponent;
