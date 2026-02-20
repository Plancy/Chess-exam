import './row.css';
export function ArrowSVG({ x1, y1, x2, y2 }) {
	const ah = 0.25;
	const dx = x2 - x1;
	const dy = y2 - y1;
	const len = Math.sqrt(dx * dx + dy * dy);
	if (len === 0) return null;
	const nx = dx / len, ny = dy / len;
	const ax = x2 - nx * ah, ay = y2 - ny * ah;
	const perp = 0.12;
	return (
		<g>
			<line x1={x1} y1={y1} x2={ax} y2={ay} stroke="#e67e22" strokeWidth="0.18" strokeLinecap="round" />
			<polygon
				points={`
					${x2},${y2}
					${ax - ny * perp},${ay + nx * perp}
					${ax + ny * perp},${ay - nx * perp}
				`}
				fill="#e67e22"
			/>
		</g>
	);
}
