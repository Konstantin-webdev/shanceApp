// components/Training/topics/OverallProgressCircle.tsx
import { useTheme } from "@/components/ThemeProvider";
import { Text, View } from "react-native";
import Svg, { Circle, G } from "react-native-svg";

interface OverallProgressCircleProps {
    answered: number;
    total: number;
    size?: number;
    strokeWidth?: number;
}

export function OverallProgressCircle({
    answered,
    total,
    size = 100,
    strokeWidth = 8,
}: OverallProgressCircleProps) {
    const { colors } = useTheme();
    const percent = total === 0 ? 0 : (answered / total) * 100;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percent / 100) * circumference;

    // Определяем цвет в зависимости от процента
    let progressColor = colors.primary;
    if (percent >= 80) progressColor = "#22c55e"; // зелёный
    else if (percent >= 40) progressColor = "#eab308"; // жёлтый
    else progressColor = colors.primary;

    return (
        <View style={{ alignItems: "center", justifyContent: "center" }}>
            <Svg width={size} height={size}>
                <G rotation="-90" originX={size / 2} originY={size / 2}>
                    {/* Фоновый круг */}
                    <Circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke={colors.border}
                        strokeWidth={strokeWidth}
                        fill="transparent"
                    />
                    {/* Круг прогресса */}
                    <Circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke={progressColor}
                        strokeWidth={strokeWidth}
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                    />
                </G>
            </Svg>
            <Text
                style={{
                    position: "absolute",
                    fontSize: size * 0.2,
                    fontWeight: "bold",
                    color: colors.text,
                }}
            >
                {Math.round(percent)}%
            </Text>
        </View>
    );
}