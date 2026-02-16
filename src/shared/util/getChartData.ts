import type { BarData, GradeCounts } from "@/types/chart";
import type { Grade, Route } from "@/types/route";
import { GRADES_COLORS } from "@/types/route";
import { getGradeKey } from "./getGradeKey";

export const groupChartData = (gradeCounts: GradeCounts): BarData[] => Object.keys(GRADES_COLORS).map((grade: string): BarData => {
    const count = gradeCounts[grade] || 0;
    const gradeKey = getGradeKey(grade as Grade);
    return {
        label: grade,
        value: count,
        color: GRADES_COLORS[gradeKey.replace('+', '')],
    };
}).filter((item: BarData): boolean => item.value > 0);

export const getGradeCounts = (data: Route[]): GradeCounts => {
    const gradeCounts: GradeCounts = {};
    data.forEach((route) => {
      const gradeKey = getGradeKey(route.grade).replace('+', '');
      gradeCounts[gradeKey] = (gradeCounts[gradeKey] || 0) + 1;
    });
    return gradeCounts;
};

export const getChartData = (data: Route[]): BarData[] => {
    const gradeCounts: GradeCounts = getGradeCounts(data);
    return groupChartData(gradeCounts);
};
