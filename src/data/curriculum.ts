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
  {
    id: "angle-sum",
    title: "Angle Sum Property",
    icon: "triangle",
    color: "hsl(270, 55%, 60%)",
    story: "Imagine designing a hexagon window (6 sides) for your dream treehouse. To make it fit perfectly, you need to know the total 'space' inside all the corners combined. Here's the trick: any polygon can be split into triangles, and each triangle has 180°!",
    question: {
      id: "q5",
      text: "What is the total sum of all interior angles in a 6-sided hexagon?",
      options: [
        { label: "A", text: "360°", misconception: "360° is the sum of EXTERIOR angles for any polygon, not the interior angles of a hexagon." },
        { label: "B", text: "540°", misconception: "540° is the interior angle sum of a PENTAGON (5 sides). A hexagon has one more side!" },
        { label: "C", text: "720°" },
        { label: "D", text: "1080°", misconception: "1080° is the interior angle sum of an OCTAGON (8 sides). Count again — a hexagon has only 6 sides." },
      ],
      correctAnswer: "C",
      hints: [
        "A square (4 sides) can be split into 2 triangles inside. How many triangles fit in a 6-sided shape?",
        "Use the formula: (n − 2) × 180°. Here, n is 6.",
        "4 triangles × 180° = 720°!",
      ],
    },
  },
  {
    id: "kite",
    title: "Properties of a Kite",
    icon: "wind",
    color: "hsl(200, 60%, 52%)",
    story: "To make a kite fly straight and true, the crossing support sticks (diagonals) must have a very specific relationship. Two pairs of neighboring sides are equal, and the sticks always cross at a special angle — like a perfect plus sign!",
    question: {
      id: "q6",
      text: "Which of these is a 'must-have' rule for a geometric kite?",
      options: [
        { label: "A", text: "Equal diagonals", misconception: "Equal diagonals is a property of a RECTANGLE, not a kite. In a kite, the diagonals are usually different lengths." },
        { label: "B", text: "Diagonals cross at 90°" },
        { label: "C", text: "Opposite sides are parallel", misconception: "Parallel opposite sides make it a PARALLELOGRAM. A kite has equal ADJACENT sides, not parallel opposite ones." },
        { label: "D", text: "All 4 angles are 90°", misconception: "All 90° angles would make it a RECTANGLE or SQUARE. A kite usually has unequal angles." },
      ],
      correctAnswer: "B",
      hints: [
        "Kites aren't parallelograms — their neighbors are equal, not their opposites!",
        "Think of the 'plus-sign' shape the support sticks make in the middle.",
        "Perpendicular means they meet at exactly 90 degrees!",
      ],
    },
  },
  {
    id: "rectangle",
    title: "Rectangles",
    icon: "rectangle-horizontal",
    color: "hsl(150, 50%, 45%)",
    story: "You are building a door frame. If the diagonal from the top-left corner to the bottom-right corner is exactly 2 meters, a special rectangle rule tells you exactly what the other diagonal measures — without even getting out your tape!",
    question: {
      id: "q7",
      text: "If one diagonal of a perfect rectangle is 2 meters, what must the other diagonal be?",
      options: [
        { label: "A", text: "1 meter", misconception: "The diagonals of a rectangle are EQUAL, not half of each other. You might be thinking of a midpoint." },
        { label: "B", text: "2 meters" },
        { label: "C", text: "4 meters", misconception: "4 meters would be DOUBLE the diagonal. A rectangle's diagonals are equal, not doubled!" },
        { label: "D", text: "It varies by width", misconception: "In a rectangle, the diagonals are ALWAYS equal regardless of width or height. This is a guaranteed rule!" },
      ],
      correctAnswer: "B",
      hints: [
        "A rectangle is a very 'even' parallelogram — everything is balanced.",
        "One of a rectangle's superpowers is perfectly identical diagonals.",
        "If one diagonal is 2m, the other must be exactly 2m too!",
      ],
    },
  },
  {
    id: "square-identity",
    title: "The Square's Secret",
    icon: "crown",
    color: "hsl(45, 85%, 50%)",
    story: "A square is being interviewed for a job at the Shape Academy. It claims: \"I am actually a Rhombus AND a Rectangle at the same time!\" The interviewer looks skeptical. Let's check if the square is telling the truth...",
    question: {
      id: "q8",
      text: "A square says: \"I am both a Rhombus and a Rectangle.\" Is it telling the truth?",
      options: [
        { label: "A", text: "Yes — it has 4 equal sides AND 90° corners" },
        { label: "B", text: "No — it is just a square", misconception: "A square isn't 'just' a square! Shapes can belong to multiple families if they follow all the rules. Think of it like being both a student and a musician." },
        { label: "C", text: "No — a rhombus must be slanted", misconception: "A rhombus does NOT have to be slanted! The only rule is 4 equal sides. A square has 4 equal sides, so it qualifies." },
        { label: "D", text: "Only if it's turned sideways", misconception: "Rotating a shape doesn't change its properties! A square is still a square whether it's straight or tilted." },
      ],
      correctAnswer: "A",
      hints: [
        "What are the rules for a Rhombus? Just 4 equal sides. Does a square have those?",
        "What are the rules for a Rectangle? All 90° corners. Does a square have those?",
        "Since it follows ALL the rules of both shapes, it belongs to both families!",
      ],
    },
  },
];
