import React, { useState, useEffect } from 'react';

import ThreeGlobe from 'three-globe';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import countries from "../assets/files/globe-data-min.json";
import travelHistory from "../assets/files/my-flights.json";
import dotsData from "../assets/files/my-dots.json";
import * as THREE from 'three'

const Globe = () => {
    const [globe, setGlobe] = useState();

    useEffect(() => {
        let Globe = new ThreeGlobe({
            waitForGlobeReady: true,
            animateIn: true,
        }).hexPolygonsData(countries.features)
            .hexPolygonResolution(3)
            .hexPolygonMargin(0.5)
            .showAtmosphere(true)
            .atmosphereColor("#b7b7b7")
            .atmosphereAltitude(0.25)
            .hexPolygonColor((e) => { return "#000000"; })

        Globe.arcsData(travelHistory.flights)
            .labelsData(dotsData.dots)
            .labelColor(() => {
                if (Math.floor(Math.random() * 10) % 2) {
                    return "#ff0000";
                } else {
                    return "#1111f5";
                }
            })
            .labelDotRadius((e) => e.size)
            .labelResolution(6)
            .labelAltitude(0.002)

        const globeMaterial = Globe.globeMaterial();
        globeMaterial.color = new THREE.Color(0xffffff);
        globeMaterial.emissive = new THREE.Color(0x220038);
        globeMaterial.emissiveIntensity = 0.1;
        globeMaterial.shininess = 0.7;

        setGlobe(Globe)
    }, []);

    return (
        <Canvas
            camera={{
                position: [0, 0, 200],
            }}
            linear={true}
            resize={{ scroll: false }}
            scene={{
                fog: {
                    color: '0x535ef3',
                    near: 400,
                    far: 2000
                },
                background: '0xffffff'
            }}
        >
            <PerspectiveCamera makeDefault position={[0, 0, 300]}  >
                <directionalLight color={0xffffff} intensity={0.8} position={[0, 0, 0]} />
                <directionalLight color={0xffffff} intensity={0.8} position={[-800, 2000, 400]} />
            </PerspectiveCamera>
            <color attach="background" args={['#ffffff']} />
            <OrbitControls zoomSpeed={0} autoRotate={true} minPolarAngle={Math.PI / 2.5} maxPolarAngle={Math.PI / 2.5} />
            <ambientLight color={'#ffffff'} intensity={1} />
            <directionalLight position={[100, 100, 100]} />
            <primitive object={globe} />
        </Canvas>
    )
}

export default Globe;