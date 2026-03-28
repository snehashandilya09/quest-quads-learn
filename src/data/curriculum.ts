export interface Option {
  label: string;
  text: string;
  misconception?: string;
}

export interface Question {
  id: string;
  text: string;
  options: Option[];
  correctAnswer: string;
  hints: [string, string, string];
}

export interface Module {
  id: string;
  title: string;
  icon: string;
  story: string;
  question: Question;
  color: string;
}

export const modules: Module[] = [
  {
    id: "polygons",
    title: "Polygons",
    icon: "hexagon",
    color: "hsl(243, 60%, 58%)",
    story: "Imagine a wooden frame. If all sides and angles are identical, it is a 'Regular' polygon. A regular polygon is like a perfectly balanced shape — every edge the same length, every corner the same angle. Think of a stop sign (octagon) or a honeycomb cell (hexagon).",
    question: {
      id: "q1",
      text: "Why is a square a 'Regular' polygon?",
      options: [
        { label: "A", text: "It has 4 sides", misconception: "Having 4 sides only makes it a quadrilateral, not necessarily regular. A trapezoid also has 4 sides!" },
        { label: "B", text: "It has parallel sides", misconception: "Parallel sides make it a parallelogram. A rectangle has parallel sides too, but regularity needs more." },
        { label: "C", text: "Equal sides AND equal angles", },
        { label: "D", text: "It is a closed curve", misconception: "All polygons are closed figures. That alone doesn't make one 'regular'." },
      ],
      correctAnswer: "C",
      hints: [
        "Think about it: 4 sides just makes it a quadrilateral. What else is special about a square?",
        "'Regular' means perfectly balanced — nothing uneven at all.",
        "Look for BOTH equal sides AND equal angles together.",
      ],
    },
  },
  {
    id: "exterior-angles",
    title: "Exterior Angles",
    icon: "rotate-cw",
    color: "hsl(174, 50%, 48%)",
    story: "Imagine walking along the boundary of a park shaped like a polygon. At every corner, you turn slightly to stay on the path. By the time you return to your starting point, you've made one full rotation — spinning all the way around once!",
    question: {
      id: "q2",
      text: "What is the sum of exterior angles for ANY polygon?",
      options: [
        { label: "A", text: "180°", misconception: "180° is the sum of angles in a triangle, not the exterior angles of a polygon." },
        { label: "B", text: "360°" },
        { label: "C", text: "540°", misconception: "540° is the sum of INTERIOR angles of a pentagon. Exterior angles are different!" },
        { label: "D", text: "90°", misconception: "90° is just one right angle. The exterior angles of any polygon always sum to much more." },
      ],
      correctAnswer: "B",
      hints: [
        "Don't confuse this with interior angles — 540° is the interior sum of a pentagon.",
        "Remember the walk: you made one FULL rotation around the park.",
        "A full circle of rotation = 360°.",
      ],
    },
  },
  {
    id: "parallelograms",
    title: "Parallelograms",
    icon: "square",
    color: "hsl(330, 65%, 62%)",
    story: "Picture a slanted roof on a house. The two corners right next to each other (adjacent angles) must balance out to keep the top and bottom edges parallel. They're like a seesaw — when one goes up, the other adjusts to maintain the balance.",
    question: {
      id: "q3",
      text: "If Angle A in a parallelogram is 80°, what is the adjacent Angle B?",
      options: [
        { label: "A", text: "80°", misconception: "80° would be the OPPOSITE angle, not the adjacent one. Adjacent angles in a parallelogram are supplementary." },
        { label: "B", text: "100°" },
        { label: "C", text: "360°", misconception: "360° is the total of ALL angles in a quadrilateral, not just one angle." },
        { label: "D", text: "90°", misconception: "90° would only work if it were a rectangle. A general parallelogram doesn't need right angles." },
      ],
      correctAnswer: "B",
      hints: [
        "80° is for the OPPOSITE corner, not the one next to it.",
        "Adjacent angles in a parallelogram are supplementary (they add up to a straight line).",
        "A straight line = 180°. So 180° − 80° = ?",
      ],
    },
  },
  {
    id: "rhombus",
    title: "The Rhombus",
    icon: "diamond",
    color: "hsl(38, 92%, 55%)",
    story: "Think of a kite made from 4 sticks of equal length. When you connect opposite corners with strings, those crossing supports are forced to meet at a perfect right angle — like a plus sign (+). The equal sides create this special property!",
    question: {
      id: "q4",
      text: "What angle do the diagonals of a Rhombus form where they cross?",
      options: [
        { label: "A", text: "60°", misconception: "60° is the angle of an equilateral triangle. Rhombus diagonals have a different special property." },
        { label: "B", text: "180°", misconception: "180° would mean the diagonals form a straight line — but they actually cross!" },
        { label: "C", text: "90°" },
        { label: "D", text: "45°", misconception: "45° is half of a right angle. The diagonals of a rhombus form a full right angle." },
      ],
      correctAnswer: "C",
      hints: [
        "180° means a flat line — diagonals definitely cross, they don't lie flat.",
        "Equal edges force the crossing supports into a perfect 'plus sign' shape.",
        "They are perpendicular — that means 90°!",
      ],
    },
  },
];
