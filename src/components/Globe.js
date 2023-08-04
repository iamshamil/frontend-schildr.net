import createGlobe from "cobe";
import { useEffect, useRef } from "react";
import { useSpring } from 'react-spring';

const Cobe = () => {
    const canvasRef = useRef();
    const pointerInteracting = useRef(null);
    const pointerInteractionMovement = useRef(0);

    const [{ r }, api] = useSpring(() => (
        {
            r: 0,
            config: {
                mass: 1,
                tension: 280,
                friction: 40,
                precision: 0.001,
            },
        }));

    useEffect(() => {
        let width = 0;
        const onResize = () => canvasRef.current && (width = canvasRef.current.offsetWidth)
        window.addEventListener('resize', onResize)
        onResize()

        const globe = createGlobe(canvasRef.current,
            {
                devicePixelRatio: 2,
                width: 800 * 2,
                height: 800 * 2,
                phi: 0,
                theta: 0,
                dark: 0,
                diffuse: 1.2,
                mapSamples: 20000,
                mapBrightness: 6,
                baseColor: [1.02, 1, 1],
                markerColor: [1, 0.1, 0.1],
                glowColor: [0.705, 0.7, 0.7],
                markers: [
                    // // us
                    { location: [14.7595, -90.4367], size: 0.03 },
                    // { location: [37.7595, -122.4367], size: 0.03 },
                    // { location: [40.7128, -74.006], size: 0.03 },
                    // // latin
                    { location: [52.7128, -100.006], size: 0.03 },
                    // // south america
                    { location: [-32.7128, -70.006], size: 0.03 },
                    // { location: [-5.7128, -60.006], size: 0.03 },
                    // { location: [-12.7128, -40.006], size: 0.03 },
                    // // australia
                    // { location: [-19, -212], size: 0.03 },
                    { location: [-17, -235], size: 0.03 },
                    // // new zealand
                    // { location: [-40, -185], size: 0.03 },
                    // // indonesia
                    { location: [-4.3, -226], size: 0.03 },
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
                    { location: [50, -230], size: 0.03 },
                    // // russia
                    // { location: [50, -260], size: 0.03 },
                    // // asia
                    // { location: [45, -270], size: 0.03 },
                    { location: [30, -270], size: 0.03 },
                    // { location: [35, -290], size: 0.03 },
                    // // europe
                    { location: [35, -300], size: 0.03 },
                    // { location: [48, -360], size: 0.03 },
                    // { location: [40, -340], size: 0.03 },
                    // { location: [45, -330], size: 0.03 },
                    // { location: [50, -300], size: 0.03 },
                    // // africa
                    // { location: [-30, 20], size: 0.03 },
                    { location: [-10, 30], size: 0.03 },
                    // { location: [-10, 30], size: 0.03 },
                    // { location: [-20, 48], size: 0.03 },
                    // { location: [0, 17], size: 0.03 },
                    // { location: [20, 0], size: 0.03 },
                ],
                onRender: (state) => {
                    if (canvasRef.current.style.cursor === 'grab') {
                        api.start({ r: r.get() + 0.01 });
                    }
                    state.phi = r.get()
                    state.width = width * 2
                    state.height = width * 2
                }
            })

        setTimeout(() => canvasRef.current.style.opacity = '1')
        return () => {
            globe.destroy();
        }
    }, [r, api])

    return (
        <div style={{ width: '100%', maxWidth: 600, aspectRatio: 1, margin: 'auto', position: 'relative', }}>
            <canvas
                ref={canvasRef}
                onPointerDown={(e) => {
                    pointerInteracting.current = e.clientX - pointerInteractionMovement.current;
                    canvasRef.current.style.cursor = 'grabbing';
                }}
                onPointerUp={() => {
                    pointerInteracting.current = null;
                    canvasRef.current.style.cursor = 'grab';
                }}
                onPointerOut={() => {
                    pointerInteracting.current = null;
                    canvasRef.current.style.cursor = 'grab';
                }}
                onMouseMove={(e) => {
                    if (pointerInteracting.current !== null) {
                        const delta = e.clientX - pointerInteracting.current;
                        pointerInteractionMovement.current = delta;
                        api.start({ r: delta / 150, });
                    }
                }}
                onTouchMove={(e) => {
                    if (pointerInteracting.current !== null && e.touches[0]) {
                        const delta = e.touches[0].clientX - pointerInteracting.current;
                        pointerInteractionMovement.current = delta;
                        api.start({ r: delta / 100, });
                    }
                }}
                style={{ width: 800, height: 800, cursor: 'grab', contain: 'layout paint size', opacity: 0, transition: 'opacity 1s ease', }} />
        </div>
    )
}

export default Cobe;


// import createGlobe from "cobe";
// import { useEffect, useRef } from "react";
// import { useSpring } from 'react-spring';

// export default function Cobe() {
//     const canvasRef = useRef();
//     const pointerInteracting = useRef(null);
//     const pointerInteractionMovement = useRef(0);
//     const [{ r }, api] = useSpring(() => (
//         {
//             r: 0,
//             config: { mass: 1, tension: 280, friction: 40, precision: 0.001, },
//         }
//     ));

//     useEffect(() => {
//         let width = 0;
//         const onResize = () => canvasRef.current && (width = canvasRef.current.offsetWidth)
//         window.addEventListener('resize', onResize)
//         onResize()

//         const globe = createGlobe(canvasRef.current,
//             {
//                 devicePixelRatio: 2,
//                 width: width * 2,
//                 height: width * 2,
//                 phi: 0,
//                 theta: 0,
//                 dark: 0,
//                 diffuse: 1.2,
//                 mapSamples: 20000,
//                 mapBrightness: 6,
//                 baseColor: [1.02, 1, 1],
//                 markerColor: [1, 0.1, 0.1],
//                 glowColor: [0.705, 0.7, 0.7],
//                 markers: [
                   
//                 ],
//                 onRender: (state) => {
//                     api.start({ r: r.get() + 0.01 });
//                     state.phi = r.get()
//                     state.width = width * 2
//                     state.height = width * 2
//                 }
//             })
//         setTimeout(() => canvasRef.current.style.opacity = '1')
//         return () => globe.destroy()
//     }, [])

//     return (
//         <div style={{ width: '100%', maxWidth: 600, aspectRatio: 1, margin: 'auto', position: 'relative' }}>
//             <canvas
//                 ref={canvasRef}
//                 onPointerDown={(e) => {
//                     pointerInteracting.current = e.clientX - pointerInteractionMovement.current;
//                     canvasRef.current.style.cursor = 'grabbing';
//                 }}
//                 onPointerUp={() => {
//                     pointerInteracting.current = null;
//                     canvasRef.current.style.cursor = 'grab';
//                 }}
//                 onPointerOut={() => {
//                     pointerInteracting.current = null;
//                     canvasRef.current.style.cursor = 'grab';
//                 }}
//                 onMouseMove={(e) => {
//                     if (pointerInteracting.current !== null) {
//                         const delta = e.clientX - pointerInteracting.current;
//                         pointerInteractionMovement.current = delta;
//                         api.start({ r: delta / 200, });
//                     }
//                 }}
//                 onTouchMove={(e) => {
//                     if (pointerInteracting.current !== null && e.touches[0]) {
//                         const delta = e.touches[0].clientX - pointerInteracting.current;
//                         pointerInteractionMovement.current = delta; api.start({ r: delta / 100, });
//                     }
//                 }}
//                 style={{ width: '100%', height: '100%', cursor: 'grab', contain: 'layout paint size', opacity: 0, transition: 'opacity 1s ease', }}
//             />
//         </div>
//     )
// }