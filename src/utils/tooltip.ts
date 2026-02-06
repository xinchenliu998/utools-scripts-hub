/**
 * Tooltip 定位工具函数
 * 提供统一的 tooltip 位置计算逻辑
 */

import { computed } from 'vue'

/**
 * 根据列表项的索引计算 tooltip 显示位置
 * - 第一项（索引0）在下面显示
 * - 最后一项在上面显示
 * - 中间项默认在下面显示
 *
 * @param index 当前项的索引
 * @param total 列表总长度
 * @returns tooltip 显示位置
 */
export function useTooltipPosition(index: () => number, total: () => number) {
  return computed(() => {
    const idx = index()
    const len = total()
    if (idx === 0) {
      return 'bottom'
    } else if (idx === len - 1) {
      return 'top'
    }
    return 'bottom'
  })
}

/**
 * 简单的 tooltip 位置计算函数（同步版本）
 */
export function calculateTooltipPosition(index: number, total: number): 'top' | 'bottom' {
  if (index === 0) {
    return 'bottom'
  } else if (index === total - 1) {
    return 'top'
  }
  return 'bottom'
}
