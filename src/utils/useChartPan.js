import { useState, useRef, useEffect, useCallback } from 'react'

/**
 * 차트 본체를 마우스/터치로 드래그해 좌우로 패닝(이동)하는 훅.
 * 전체 데이터 중 windowSize 개수만큼의 구간을 보여주고, 드래그로 그 구간을 옮긴다.
 * (Recharts Brush 대신 그래프 자체를 잡아끄는 UX)
 *
 * @param {number} dataLength 전체 데이터 포인트 수
 * @param {number} [windowSize=20] 한 번에 보여줄 포인트 수
 * @returns {{
 *   containerRef: React.RefObject,    // 차트를 감싼 div에 연결
 *   sliceStart: number,               // 표시 구간 시작 인덱스
 *   sliceEnd: number,                 // 표시 구간 끝 인덱스(exclusive)
 *   canPan: boolean,                  // 패닝 가능 여부(데이터가 window보다 많을 때)
 *   handlers: object                  // div에 펼쳐 넣을 포인터 이벤트 핸들러
 * }}
 */
export const useChartPan = (dataLength, windowSize = 20) => {
  const maxStart = Math.max(0, dataLength - windowSize)
  const [viewStart, setViewStart] = useState(maxStart)
  const containerRef = useRef(null)
  const dragRef = useRef(null) // { startX, startView }

  // 데이터 길이가 바뀌면 최신(가장 오른쪽) 구간으로 리셋
  useEffect(() => {
    setViewStart(Math.max(0, dataLength - windowSize))
  }, [dataLength, windowSize])

  const clamp = useCallback((v) => Math.max(0, Math.min(maxStart, v)), [maxStart])

  const onPointerDown = useCallback((e) => {
    if (maxStart === 0) return // 패닝할 게 없으면 무시
    dragRef.current = { startX: e.clientX, startView: viewStart }
    try { e.currentTarget.setPointerCapture?.(e.pointerId) } catch { /* noop */ }
  }, [maxStart, viewStart])

  const onPointerMove = useCallback((e) => {
    if (!dragRef.current) return
    const width = containerRef.current?.offsetWidth || 1
    const pxPerIndex = width / windowSize
    const delta = Math.round((e.clientX - dragRef.current.startX) / pxPerIndex)
    // 오른쪽으로 끌면(delta > 0) 과거로 이동(시작 인덱스 감소)
    setViewStart(clamp(dragRef.current.startView - delta))
  }, [windowSize, clamp])

  const endDrag = useCallback(() => { dragRef.current = null }, [])

  const start = clamp(viewStart)
  return {
    containerRef,
    sliceStart: start,
    sliceEnd: start + windowSize,
    canPan: maxStart > 0,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: endDrag,
      onPointerLeave: endDrag,
      onPointerCancel: endDrag,
    },
  }
}
