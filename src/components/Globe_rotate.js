import createGlobe from "cobe";
import { useEffect, useRef } from "react";

const glob = () => {
    // eslint-disable-next-line
    const canvasRef = useRef();
    // eslint-disable-next-line
    useEffect(() => {
        let phi = 0;

        const globe = createGlobe(canvasRef.current, {
            devicePixelRatio: 2,
            width: 100 * 2,
            height: 100 * 2,
            phi: 0,
            theta: 0,
            dark: 0,
            diffuse: 1.2,
            mapSamples: 10000,
            mapBrightness: 6,
            baseColor: [1.02, 1, 1],
            markerColor: [1, 0.1, 0.1],
            glowColor: [0.705, 0.7, 0.7],
            markers: [
                // // us
                // { location: [14.7595, -90.4367], size: 0.03 },
                // { location: [37.7595, -122.4367], size: 0.03 },
                // { location: [40.7128, -74.006], size: 0.03 },
                // // latin
                // { location: [52.7128, -100.006], size: 0.03 },
                // // south america
                // { location: [-32.7128, -70.006], size: 0.03 },
                // { location: [-5.7128, -60.006], size: 0.03 },
                // { location: [-12.7128, -40.006], size: 0.03 },
                // // australia
                // { location: [-19, -212], size: 0.03 },
                // { location: [-17, -235], size: 0.03 },
                // // new zealand
                // { location: [-40, -185], size: 0.03 },
                // // indonesia
                // { location: [-4.3, -226], size: 0.03 },
                // { location: [-3.3, -232], size: 0.03 },
                // { location: [-2, -250], size: 0.03 },
                // // japan
                // { location: [38, -220], size: 0.03 },
                // // south korea
                // { location: [38, -234], size: 0.03 },
                // // taiwan
                // { location: [25, -238], size: 0.03 },
                // // china
                // { location: [35, -250], size: 0.03 },
                // { location: [50, -230], size: 0.03 },
                // // russia
                // { location: [50, -260], size: 0.03 },
                // // asia
                // { location: [45, -270], size: 0.03 },
                // { location: [30, -270], size: 0.03 },
                // { location: [35, -290], size: 0.03 },
                // // europe
                // { location: [35, -300], size: 0.03 },
                // { location: [48, -360], size: 0.03 },
                // { location: [40, -340], size: 0.03 },
                // { location: [45, -330], size: 0.03 },
                // { location: [50, -300], size: 0.03 },
                // // africa
                // { location: [-30, 20], size: 0.03 },
                // { location: [-10, 30], size: 0.03 },
                // { location: [-10, 30], size: 0.03 },
                // { location: [-20, 48], size: 0.03 },
                // { location: [0, 17], size: 0.03 },
                // { location: [20, 0], size: 0.03 },
            ],
            onRender: (state) => {
                state.phi = phi;
                phi += 0.01;
            }
        });

        return () => {
            globe.destroy();
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{ width: 100, height: 100, maxWidth: "100%", aspectRatio: 1 }}
        />
    );
}

export default glob;