export const vertexShader = `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const fragmentShader = `
uniform vec2 uOffset;
uniform vec2 uResolution;
uniform vec4 uBorderColor;
uniform vec4 uHoverColor;
uniform vec4 uBackgroundColor;
uniform vec2 uMousePos;
uniform float uZoom;
uniform float uCellSize;
uniform float uTextureCount;
uniform sampler2D uImageAtlas;
uniform sampler2D uTextAtlas;
uniform bool uFlipHorizontal;  // 新增：控制水平翻转
uniform bool uFlipVertical;    // 新增：控制垂直翻转
varying vec2 vUv;

void main() {
    // 计算基本UV坐标
    // vec2 screenUV = (vUv - 0.5) * 2.0;
    vec2 screenUV = (vUv - 0.5) * 2.0;

    
    // 应用视口比例
    vec2 aspectRatio = vec2(uResolution.x / uResolution.y, 1.55);
    vec2 worldCoord = screenUV * aspectRatio;

    // 应用缩放和偏移
    worldCoord *= uZoom;
    worldCoord += uOffset;

    // 计算单元格位置
    vec2 cellPos = worldCoord / uCellSize;
    vec2 cellId = floor(cellPos);
    vec2 cellUV = fract(cellPos);

    // 计算图片索引
    float imageIndex = mod(cellId.x + cellId.y * 3.0, uTextureCount);

    // 在单元格内留出边距
    float margin = 0.1; // 10% 的边距
    vec2 innerUV = (cellUV - margin) / (1.0 - 2.0 * margin);

    vec3 color = uBackgroundColor.rgb;
    float alpha = 1.0;

    // 检查是否在图片显示区域内
    if (innerUV.x >= 0.0 && innerUV.x <= 1.0 && innerUV.y >= 0.0 && innerUV.y <= 1.0) {
        // 应用水平和垂直翻转
        vec2 flippedUV = innerUV;
        if (uFlipHorizontal) {
            flippedUV.x = 1.0 - flippedUV.x;
        }
        if (uFlipVertical) {
            flippedUV.y = 1.0 - flippedUV.y;
        }

        // 计算最终的纹理坐标
        vec2 finalUV = vec2(
            flippedUV.x,
            (flippedUV.y + imageIndex) / uTextureCount
        );
        vec4 imageColor = texture2D(uImageAtlas, finalUV);
        color = mix(color, imageColor.rgb, imageColor.a);
    }

    // 添加网格线
    float gridLine = step(0.98, cellUV.x) + step(0.98, cellUV.y);
    color = mix(color, uBorderColor.rgb, gridLine * uBorderColor.a);

    // 添加边缘渐变
    float radius = length(screenUV);
    float vignette = 1.0 - smoothstep(0.8, 1.4, radius);
    color *= vignette;

    gl_FragColor = vec4(color, alpha);
}
`;