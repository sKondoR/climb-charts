import * as THREE from 'three';

function getHeightAt(x, z) {
    const dist = Math.sqrt(x*x + z*z);
    let y = 10 * Math.exp(-dist * dist / 20);
    y += 0.4 * Math.sin(x * 1.5) * Math.cos(z * 1.3);
    y += 0.3 * Math.sin(x * 3.0) * 0.5;
    if (dist > 8) y *= Math.max(0, 1 - (dist-8)/6);
    return Math.max(0.1, y);
}

export function findContourPoints(heightTarget = 5, numPoints = 60) {
    const points = [];
    const stepAngle = (Math.PI * 2) / numPoints;
    
    // Определим разумные границы для радиуса поиска
    const maxRadius = 15; // Максимальное расстояние от центра
    const minRadius = 0.1; // Минимальное расстояние от центра
    
    for (let i = 0; i < numPoints; i++) {
        const angle = i * stepAngle;
        
        // Используем бинарный поиск для нахождения правильного радиуса
        let low = minRadius;
        let high = maxRadius;
        let bestRadius = null;
        let bestHeightDiff = Infinity;
        
        // Попробуем несколько итераций бинарного поиска
        for (let iter = 0; iter < 20; iter++) {
            const radius = (low + high) / 2;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            const currentHeight = getHeightAt(x, z);
            const heightDiff = Math.abs(currentHeight - heightTarget);
            
            // Обновляем лучший результат
            if (heightDiff < bestHeightDiff) {
                bestHeightDiff = heightDiff;
                bestRadius = radius;
            }
            
            // Если нашли точное совпадение, выходим
            if (heightDiff < 0.01) {
                break;
            }
            
            // Корректируем границы поиска
            if (currentHeight > heightTarget) {
                low = radius; // Нужно увеличить радиус
            } else {
                high = radius; // Нужно уменьшить радиус
            }
        }
        
        // Если нашли подходящий радиус, добавляем точку
        if (bestRadius !== null && bestHeightDiff < 0.5) {
            const x = Math.cos(angle) * bestRadius;
            const z = Math.sin(angle) * bestRadius;
            points.push(new THREE.Vector3(x, heightTarget, z));
        }
    }
    return points;
}
