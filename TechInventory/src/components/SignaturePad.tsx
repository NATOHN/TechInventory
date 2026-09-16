// 1. Importaciones
import { useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { View, StyleSheet, PanResponder, GestureResponderEvent } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../context/ThemeContext';

// 2. Metodos que el componente padre puede invocar mediante una referencia.
export type SignaturePadRef = {
  clear: () => void;
  isEmpty: () => boolean;
};

// 3. Un trazo es una lista de puntos que forman una linea continua.
type Point = { x: number; y: number };

const SignaturePad = forwardRef<SignaturePadRef, {}>((_props, ref) => {
  // 4. Obtenemos la paleta de colores actual desde ThemeContext.
  const { colors } = useTheme();

  // 5. Guardamos todos los trazos ya completados, y el trazo que se esta dibujando actualmente.
  const [paths, setPaths] = useState<Point[][]>([]);
  const currentPath = useRef<Point[]>([]);
  const [, forceRender] = useState(0);

  // 6. Convierte un arreglo de puntos en una cadena de instrucciones SVG (formato "d" de <Path>).
  const pointsToPath = (points: Point[]): string => {
    if (points.length === 0) return '';
    const [first, ...rest] = points;
    return `M ${first.x} ${first.y} ` + rest.map((p) => `L ${p.x} ${p.y}`).join(' ');
  };

  // 7. Configuramos el PanResponder para detectar el gesto de dibujo con el dedo o el mouse.
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      // 8. Al iniciar el trazo, comenzamos un arreglo de puntos nuevo.
      onPanResponderGrant: (evt: GestureResponderEvent) => {
        const { locationX, locationY } = evt.nativeEvent;
        currentPath.current = [{ x: locationX, y: locationY }];
        forceRender((n) => n + 1);
      },

      // 9. Mientras se mueve el dedo, agregamos cada punto nuevo al trazo actual.
      onPanResponderMove: (evt: GestureResponderEvent) => {
        const { locationX, locationY } = evt.nativeEvent;
        currentPath.current = [...currentPath.current, { x: locationX, y: locationY }];
        forceRender((n) => n + 1);
      },

      // 10. Al soltar el dedo, guardamos el trazo completo dentro del arreglo de trazos.
      onPanResponderRelease: () => {
        setPaths((prev) => [...prev, currentPath.current]);
        currentPath.current = [];
      },
    })
  ).current;

  // 11. Exponemos metodos utiles al componente padre: limpiar el lienzo y saber si esta vacio.
  useImperativeHandle(ref, () => ({
    clear: () => {
      setPaths([]);
      currentPath.current = [];
      forceRender((n) => n + 1);
    },
    isEmpty: () => paths.length === 0 && currentPath.current.length === 0,
  }));

  return (
    // 12. collapsable={false} evita que Android "aplane" esta vista al optimizar el render,
    // lo cual hacia que ViewShot capturara el lienzo en blanco.
    <View
      collapsable={false}
      style={[styles.canvas, { backgroundColor: 'white', borderColor: colors.border }]}
      {...panResponder.panHandlers}
    >
      <Svg style={StyleSheet.absoluteFill}>
        {/* 13. Dibujamos cada trazo ya completado */}
        {paths.map((points, index) => (
          <Path
            key={index}
            d={pointsToPath(points)}
            stroke="#1E293B"
            strokeWidth={3}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
        {/* 14. Dibujamos el trazo que se esta dibujando en este momento */}
        <Path
          d={pointsToPath(currentPath.current)}
          stroke="#1E293B"
          strokeWidth={3}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
});

export default SignaturePad;

const styles = StyleSheet.create({
  canvas: {
    height: 220,
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
});