export interface Option {
  label: string;
  text: string;
  misconceptionTag?: string;
}

export interface Question {
  id: string;
  concept: string;
  text: string;
  options: Option[];
  correctAnswer: string;
  hints: [string, string, string];
}

export interface Module {
  id: string;
  title: string;
  story: string;
  questions: Question[];
}

export const modules: Module[] = [
  {
    id: "module-1-polygons",
    title: "Polygons & Basics",
    story: `
<div class='space-y-8 text-slate-800 leading-relaxed'>
  <section>
    <h3 class='font-bold text-xl mb-4 text-blue-900'>Section 1: The Blueprint of Shapes</h3>
    <p>
      Welcome to your geometry journey. Imagine you are a surveyor given a bundle of perfectly straight wooden beams.
      To create a true <strong>Polygon</strong>, you must follow two golden rules: the path must be closed and every side
      must be straight.
    </p>
    <img src="/assets/images/module1/polygon-definition.png" alt="Polygon Basics" class="rounded-lg shadow-sm border border-slate-100 max-w-sm" />
  </section>

  <section>
    <h3 class='font-bold text-xl mb-4 text-blue-900'>Section 2: Shape Personalities</h3>

    <div>
      <h4 class='font-bold text-lg mb-3 text-blue-900'>Convex vs. Concave</h4>
      <p>
        Most shapes point outward. These are <strong>Convex</strong> polygons. Some shapes have a dent pointing inward.
        This is a <strong>Concave</strong> polygon, which happens because at least one interior angle is larger than 180°.
      </p>
      <img src="/assets/images/module1/convex-concave.png" alt="Convex Concave Test" class="rounded-lg shadow-sm border border-slate-100 max-w-xs" />
    </div>

    <div>
      <h4 class='font-bold text-lg mb-3 text-blue-900'>Joining the Regular Club</h4>
      <p>
        To be called <strong>Regular</strong>, a polygon must be perfectly balanced. Every side is the same length and every
        angle is the same size. A square is regular. A rectangle is not.
      </p>
      <img src="/assets/images/module1/regular-comparison.png" alt="Regularity Check" class="rounded-lg shadow-sm border border-slate-100 max-w-sm" />
    </div>
  </section>

  <section>
    <h3 class='font-bold text-xl mb-4 text-blue-900'>Section 3: The 360° Secret</h3>
    <p>
      Here is a magic trick of geometry. No matter if a polygon has 3 sides or 300, if you walk all the way around its
      outside boundary, the total sum of your turns (the <strong>Exterior Angles</strong>) always adds up to exactly
      <strong> 360°</strong>.
    </p>
  </section>
</div>
`,
    questions: [
      {
        id: "m1_q1",
        concept: "Concave vs Convex",
        text: "If a polygon has a 'dent' pointing inward, what kind of polygon is it?",
        options: [
          { label: "A", text: "Regular", misconceptionTag: "Regular polygons must be perfectly balanced and pushed outward (convex)." },
          { label: "B", text: "Convex", misconceptionTag: "Convex means all parts of the shape push outward. No dents allowed!" },
          { label: "C", text: "Concave" },
          { label: "D", text: "Complex", misconceptionTag: "Complex usually refers to lines crossing each other. We are looking for a simpler word." }
        ],
        correctAnswer: "C",
        hints: [
          "Look at the word itself. When a shape has a dent or goes inward, it forms a kind of hollow space.",
          "Convex polygons are pushed entirely outward. If any part collapses inward, it changes its category.",
          "Shapes with an inward dent are called Con-CAVE."
        ]
      },
      {
        id: "m1_q2",
        concept: "Regular Polygons",
        text: "To be called a 'Regular' polygon, a shape must be perfectly balanced. Which shape below is Regular?",
        options: [
          { label: "A", text: "A Rectangle", misconceptionTag: "A rectangle has equal angles (90°), but its sides are not all the same length." },
          { label: "B", text: "A Rhombus", misconceptionTag: "A rhombus has equal sides, but its angles can be different (it can be tilted)." },
          { label: "C", text: "A Square" },
          { label: "D", text: "An Isosceles Triangle", misconceptionTag: "Isosceles means only two sides are equal. A regular shape needs ALL sides equal." }
        ],
        correctAnswer: "C",
        hints: [
          "To be 'Regular', a shape must have BOTH equal sides AND equal angles.",
          "Think of a rectangle (equal angles) combined with a rhombus (equal sides).",
          "Only the square has four equal sides AND four equal 90° angles."
        ]
      },
      {
        id: "m1_q3",
        concept: "Exterior Angle Sum",
        text: "If you walk all the way around the boundary of ANY polygon, what is the total sum of the exterior angles?",
        options: [
          { label: "A", text: "180°", misconceptionTag: "180° is a half-turn (like turning around). Walking around a shape requires a full turn." },
          { label: "B", text: "360°" },
          { label: "C", text: "540°", misconceptionTag: "540° is the INTERIOR angle sum of a pentagon. We are asking about the outside (exterior)." },
          { label: "D", text: "It depends on the sides", misconceptionTag: "The interior angles change based on the sides, but the exterior sum is always the same magical number." }
        ],
        correctAnswer: "B",
        hints: [
          "Imagine walking around a park shaped like a hexagon. When you return to the start, you are facing the exact same way.",
          "No matter how many sides a shape has, walking completely around it means you made one full rotation.",
          "One full circle or rotation is always exactly 360°."
        ]
      },
      {
        id: "m1_q4",
        concept: "Definition of Polygon",
        text: "Which of the following shapes is NOT a polygon?",
        options: [
          { label: "A", text: "A triangle", misconceptionTag: "A triangle is made of straight lines and is fully closed. It is the simplest polygon." },
          { label: "B", text: "A circle" },
          { label: "C", text: "A star shape", misconceptionTag: "As long as it is made of straight line segments and is closed, a star is a polygon." },
          { label: "D", text: "A square", misconceptionTag: "A square is a regular polygon with 4 straight sides." }
        ],
        correctAnswer: "B",
        hints: [
          "Think about the rules of a polygon. It must be a closed shape made entirely of straight line segments.",
          "Look at the edges of the shapes listed. Do any of them have curves?",
          "A circle is made of one continuous curve, so it cannot be a polygon!"
        ]
      },
      {
        id: "m1_q5",
        concept: "Interior Angle Sum",
        text: "You are building a pentagon-shaped (5-sided) fort. What is the total sum of all the inside (interior) angles?",
        options: [
          { label: "A", text: "360°", misconceptionTag: "360° is the sum of the EXTERIOR angles, or the interior of a 4-sided shape." },
          { label: "B", text: "540°" },
          { label: "C", text: "900°", misconceptionTag: "This would be the sum for a 7-sided shape." },
          { label: "D", text: "180°", misconceptionTag: "180° is the total for a single triangle (3 sides)." }
        ],
        correctAnswer: "B",
        hints: [
          "You can split any polygon into triangles to find its inside angles. A 5-sided shape can hold 3 triangles.",
          "Use the magic formula: (Number of sides - 2) × 180°.",
          "For a pentagon: (5 - 2) = 3. Multiply 3 × 180° to get the answer."
        ]
      }
    ]
  },
  {
    id: "module-2-parallelograms",
    title: "Parallelograms",
    story: `
<div class='space-y-8 text-slate-800 leading-relaxed'>
  <section>
    <h3 class='text-2xl font-bold text-blue-900 mb-4'>Section 1: The Blueprint of Parallel Lines</h3>
    <p>Imagine you have a rectangular picture frame. If you gently push the top corner, the frame leans. It is no longer a rectangle, but a <strong>Parallelogram</strong>. Even though it leans, the top and bottom planks stay perfectly level, like train tracks. We call these <strong>Parallel</strong> sides!</p>
    <img src='/assets/images/module2/m2_parallels.png' alt='Parallel Sides Rule' class='rounded-xl shadow-lg border-2 border-blue-100 mx-auto my-6 max-w-md' />
  </section>

  <section>
    <h3 class='text-2xl font-bold text-blue-900 mb-4'>Section 2: The Two Golden Rules</h3>
    
    <div class='bg-blue-50 p-6 rounded-2xl border-l-4 border-blue-500'>
      <h4 class='text-xl font-semibold text-blue-800 mb-2'>Rule 1: The Mirror Rule (Opposite Angles)</h4>
      <p>Corners facing each other are identical twins. If one is 70°, the one across from it is also 70°!</p>
      <img src='/assets/images/module2/m2_opposite_angles.png' alt='Opposite Angles are Equal' class='rounded-xl shadow-lg border-2 border-blue-100 mx-auto my-6 max-w-sm' />
    </div>

    <div class='bg-green-50 p-6 rounded-2xl border-l-4 border-green-500 mt-6'>
      <h4 class='text-xl font-semibold text-green-800 mb-2'>Rule 2: The Neighbor Rule (Adjacent Angles)</h4>
      <p>Side-by-side neighbors are a team. Together, they must always add up to exactly <strong>180°</strong>.</p>
      <img src='/assets/images/module2/m2_adjacent_angles.png' alt='Adjacent Angles sum to 180' class='rounded-xl shadow-lg border-2 border-blue-100 mx-auto my-6 max-w-sm' />
    </div>
  </section>

  <section>
    <h3 class='text-2xl font-bold text-blue-900 mb-4'>Section 3: The Perimeter Garden</h3>
    <p>Think of your shape as a fence. Since opposite sides are twins, you only need to know two sides to find the total distance around the garden!</p>
    <img src='/assets/images/module2/m2_perimeter.png' alt='Perimeter Calculation' class='rounded-xl shadow-lg border-2 border-blue-100 mx-auto my-6 max-w-md' />
  </section>
  
  <p class='text-center font-medium text-slate-500 italic pt-4'>Ready to test your knowledge? Click below to start the challenge!</p>
</div>
`,
    questions: [
      {
        id: "m2_q1",
        concept: "Adjacent Angles",
        text: "In a parallelogram, if Angle A is 70°, what is the measure of the adjacent Angle B?",
        options: [
          { label: "A", text: "70°", misconceptionTag: "70° would be the OPPOSITE angle. Adjacent angles (next to each other) don't match; they add up." },
          { label: "B", text: "110°" },
          { label: "C", text: "180°", misconceptionTag: "180° is the total sum of the two angles together, not the measure of just Angle B." },
          { label: "D", text: "90°", misconceptionTag: "90° only applies if this shape was specifically a rectangle." }
        ],
        correctAnswer: "B",
        hints: [
          "Are these angles facing each other (opposite) or right next to each other on the same line (adjacent)?",
          "Angles sitting next to each other on the parallel 'train tracks' are supplementary—they add up to a specific total.",
          "Adjacent angles add to 180°. Subtract 70 from 180 to find Angle B."
        ]
      },
      {
        id: "m2_q2",
        concept: "Opposite Angles",
        text: "If the bottom-left corner of a parallelogram is 65°, what is the measure of the top-right corner?",
        options: [
          { label: "A", text: "115°", misconceptionTag: "115° would be the adjacent (neighboring) angle. We are looking for the opposite one." },
          { label: "B", text: "65°" },
          { label: "C", text: "90°", misconceptionTag: "We cannot assume it is 90° unless we are told it is a rectangle." },
          { label: "D", text: "180°", misconceptionTag: "No single angle in a standard parallelogram can be 180° (a flat line)." }
        ],
        correctAnswer: "B",
        hints: [
          "These corners are looking directly across the shape at each other. They are opposite.",
          "If you cut a parallelogram diagonally, the two halves are identical triangles. This means the opposite corners match perfectly.",
          "The rule is: Opposite angles are always equal. Just copy the number!"
        ]
      },
      {
        id: "m2_q3",
        concept: "Perimeter of Parallelogram",
        text: "You are building a fence around a parallelogram garden. The top side is 12m and the left side is 7m. What is the perimeter?",
        options: [
          { label: "A", text: "19m", misconceptionTag: "You only added two sides! A perimeter goes all the way around the 4 sides." },
          { label: "B", text: "38m" },
          { label: "C", text: "24m", misconceptionTag: "This is just the top and bottom sides added together." },
          { label: "D", text: "84m", misconceptionTag: "This is the area (12 x 7). We need the perimeter (addition)." }
        ],
        correctAnswer: "B",
        hints: [
          "Perimeter means walking all the way around the fence. A parallelogram has four sides.",
          "Opposite sides are exactly the same length. If the top is 12, the bottom is 12. If the left is 7, the right is 7.",
          "Add all four sides together: 12 + 12 + 7 + 7."
        ]
      },
      {
        id: "m2_q4",
        concept: "Opposite Sides",
        text: "In a parallelogram, the top side is 15 cm long. How long is the bottom side?",
        options: [
          { label: "A", text: "10 cm", misconceptionTag: "In a parallelogram, the opposite sides don't shrink or grow; they match exactly." },
          { label: "B", text: "15 cm" },
          { label: "C", text: "30 cm", misconceptionTag: "You doubled it! The sides just need to be equal, not doubled." },
          { label: "D", text: "Not enough info", misconceptionTag: "A parallelogram has a strict rule about its opposite sides. We definitely have enough info!" }
        ],
        correctAnswer: "B",
        hints: [
          "Think about the 'train tracks' analogy. If the tracks got further apart or closer together, the train would crash.",
          "The top and bottom sides of a parallelogram are 'opposite' sides.",
          "Opposite sides are always exactly equal in length. Copy the number!"
        ]
      },
      {
        id: "m2_q5",
        concept: "Angle Relationships",
        text: "If Angle A in a parallelogram is 50°, and Angle C is directly opposite to it, what are the measures of all the other three angles?",
        options: [
          { label: "A", text: "50°, 50°, 50°", misconceptionTag: "That would mean all angles add up to 200°. A 4-sided shape must add up to 360°." },
          { label: "B", text: "130°, 50°, 130°" },
          { label: "C", text: "90°, 90°, 90°", misconceptionTag: "This only applies if the shape is a perfect rectangle." },
          { label: "D", text: "180°, 50°, 180°", misconceptionTag: "180° is a flat straight line. A corner cannot be a flat line." }
        ],
        correctAnswer: "B",
        hints: [
          "Use your two rules: Opposite angles are equal, and adjacent (neighbor) angles add up to 180°.",
          "If Angle A is 50°, the opposite Angle C is also 50°. To find the neighbors, subtract 50° from 180°.",
          "180° - 50° = 130°. So the other angles must be 130°, 50°, and 130°."
        ]
      }
    ]
  },
  {
    id: "module-3-diagonals",
    title: "Power of Diagonals",
    story: "Imagine you are building a wooden frame for a table. To make it super strong, you place two crossing wooden boards inside, forming an 'X'. These crossing boards are called diagonals. Where they cross, and how long they are, decides if your table will be a wobbly mess or a perfect shape!",
    questions: [
      {
        id: "m3_q1",
        concept: "Diagonals Bisect",
        text: "To build a proper parallelogram frame, how must you nail the two cross-beams (diagonals) together?",
        options: [
          { label: "A", text: "At the ends", misconceptionTag: "Nailing them at the ends creates a triangle or an open shape, not a four-sided frame." },
          { label: "B", text: "At exactly 90°", misconceptionTag: "That would specifically make a rhombus or square! A general parallelogram doesn't need 90°." },
          { label: "C", text: "At their exact center points" },
          { label: "D", text: "They don't need to cross", misconceptionTag: "Diagonals must connect opposite corners, so they absolutely must cross in the middle." }
        ],
        correctAnswer: "C",
        hints: [
          "For the frame to stay balanced, the cross-beams must cut each other exactly in half.",
          "In geometry, this is called 'bisecting'. Where is the bisecting point on a piece of wood?",
          "You must nail them exactly in the middle so they bisect each other."
        ]
      },
      {
        id: "m3_q2",
        concept: "Rectangle Diagonals",
        text: "If you want to build a perfect Rectangle, and your first diagonal strip is 15 cm long, how long must the second diagonal be?",
        options: [
          { label: "A", text: "10 cm", misconceptionTag: "If they are different lengths, the table will be skewed into a regular parallelogram." },
          { label: "B", text: "15 cm" },
          { label: "C", text: "30 cm", misconceptionTag: "That's double the length! It would ruin the shape." },
          { label: "D", text: "Any length", misconceptionTag: "Rectangles have a very strict rule about their diagonals to keep the 90° corners perfect." }
        ],
        correctAnswer: "B",
        hints: [
          "Think about a normal parallelogram that has been stretched straight to make a rectangle. What happens to the cross-beams?",
          "Because the corners are perfect 90° right angles, the distance between opposite corners is exactly the same.",
          "The diagonals of a rectangle are always equal in length. Copy the number!"
        ]
      },
      {
        id: "m3_q3",
        concept: "Rhombus Diagonals",
        text: "At what exact angle do the diagonals of a Rhombus intersect?",
        options: [
          { label: "A", text: "45°", misconceptionTag: "That angle is too sharp. The equal sides of a rhombus force the cross-beams to be perfectly upright and flat." },
          { label: "B", text: "60°", misconceptionTag: "60° is common in equilateral triangles, but not where rhombus diagonals cross." },
          { label: "C", text: "90°" },
          { label: "D", text: "180°", misconceptionTag: "180° is a flat straight line. The diagonals must cross each other." }
        ],
        correctAnswer: "C",
        hints: [
          "The diagonals of a rhombus form a perfect upright '+' sign in the middle.",
          "The rule says diagonals of a rhombus are 'perpendicular bisectors.' What angle represents perpendicular lines?",
          "Perpendicular lines always form perfect 90° right angles."
        ]
      },
      {
        id: "m3_q4",
        concept: "Diagonal Bisection Length",
        text: "In a parallelogram, the two diagonals cross at the center. If one full diagonal is 20 cm long, how far is it from the corner to the center dot?",
        options: [
          { label: "A", text: "20 cm", misconceptionTag: "20 cm is the entire length from corner to corner. We only want the distance to the middle." },
          { label: "B", text: "5 cm", misconceptionTag: "You divided by 4. The center only cuts the line into 2 pieces." },
          { label: "C", text: "10 cm" },
          { label: "D", text: "40 cm", misconceptionTag: "You doubled the length. We need to find a smaller piece, not a bigger one." }
        ],
        correctAnswer: "C",
        hints: [
          "The diagonals of a parallelogram 'bisect' each other.",
          "To bisect means to cut exactly in half.",
          "Simply divide the total length (20 cm) by 2."
        ]
      },
      {
        id: "m3_q5",
        concept: "Diagonal Properties Comparison",
        text: "Which shape has diagonals that are BOTH equal in length AND cross each other at a perfect 90° angle?",
        options: [
          { label: "A", text: "Rectangle", misconceptionTag: "A rectangle has equal diagonals, but they usually don't cross at 90° (unless it's a square)." },
          { label: "B", text: "Rhombus", misconceptionTag: "A rhombus crosses at 90°, but its diagonals are usually different lengths (one long, one short)." },
          { label: "C", text: "Square" },
          { label: "D", text: "Parallelogram", misconceptionTag: "A standard parallelogram doesn't have equal diagonals, nor do they cross at 90°." }
        ],
        correctAnswer: "C",
        hints: [
          "We are looking for a shape that follows the Rectangle rule (equal length) AND the Rhombus rule (90° cross).",
          "What is the 'ultimate' perfect shape that belongs to both of those families?",
          "The Square takes the best diagonal rules from both the rectangle and the rhombus!"
        ]
      }
    ]
  },
  {
    id: "module-4-rhombus-kite",
    title: "Kites & Rhombuses",
    story: "Think of a real paper kite flying in the sky. The two top edges are short and equal, and the two bottom edges are long and equal. Now, imagine using magic to stretch the top edges so all four sides become the exact same length. Your kite just transformed into a beautiful, balanced shape called a Rhombus!",
    questions: [
      {
        id: "m4_q1",
        concept: "Kite Sides",
        text: "Which statement perfectly describes the sides of a standard Kite?",
        options: [
          { label: "A", text: "All four sides are equal", misconceptionTag: "That would make it a Rhombus or a Square! A kite usually has long bottom sides and short top sides." },
          { label: "B", text: "Opposite sides are equal", misconceptionTag: "That is the rule for a Parallelogram. In a kite, opposite sides are different lengths." },
          { label: "C", text: "Two distinct pairs of touching (consecutive) sides are equal" },
          { label: "D", text: "No sides are equal", misconceptionTag: "If no sides were equal, it would just be a random, messy quadrilateral." }
        ],
        correctAnswer: "C",
        hints: [
          "Think of a real paper kite. The top two edges match each other, and the long bottom two edges match each other.",
          "Unlike a parallelogram where 'opposite' sides match, a kite has matching sides that are right next to each other.",
          "Look for 'consecutive' (touching) pairs of equal length."
        ]
      },
      {
        id: "m4_q2",
        concept: "Kite to Rhombus",
        text: "What happens if you take a Kite and make all four of its sides exactly the same length?",
        options: [
          { label: "A", text: "It becomes a Trapezium", misconceptionTag: "A trapezium only has one pair of parallel sides. Making all sides equal creates a different shape." },
          { label: "B", text: "It becomes a Rectangle", misconceptionTag: "A rectangle requires 90° corners. Changing the side lengths of a kite doesn't guarantee 90° corners." },
          { label: "C", text: "It becomes a Rhombus" },
          { label: "D", text: "It breaks", misconceptionTag: "Shapes don't break in geometry! They just evolve into more specific families." }
        ],
        correctAnswer: "C",
        hints: [
          "You now have a shape with four equal sides, but it might still be tilted like a kite.",
          "What is the special mathematical name for a parallelogram where every side is perfectly equal?",
          "An equilateral quadrilateral is called a Rhombus."
        ]
      },
      {
        id: "m4_q3",
        concept: "Rhombus Perimeter",
        text: "If one side of a rhombus is 8 cm, what is the perimeter of the entire shape?",
        options: [
          { label: "A", text: "16 cm", misconceptionTag: "You only added two sides! Perimeter goes all the way around." },
          { label: "B", text: "32 cm" },
          { label: "C", text: "64 cm", misconceptionTag: "This is the area if it were a square (8x8). Perimeter is addition." },
          { label: "D", text: "24 cm", misconceptionTag: "You added three sides. A rhombus has four sides." }
        ],
        correctAnswer: "B",
        hints: [
          "Remember the defining rule of a rhombus regarding its sides. Are they different lengths?",
          "A rhombus is like a square that got pushed over—all four sides are exactly the same.",
          "Simply multiply the one side you know by 4. 8 + 8 + 8 + 8 = ?"
        ]
      },
      {
        id: "m4_q4",
        concept: "Kite Diagonals",
        text: "In a Kite, there is one long diagonal stick going top-to-bottom, and one short diagonal stick going left-to-right. What is true about how they cross?",
        options: [
          { label: "A", text: "They don't cross at all", misconceptionTag: "Diagonals connect opposite corners, so they must cross in the middle of the kite." },
          { label: "B", text: "They cross at exactly 90°" },
          { label: "C", text: "They cut EACH OTHER in half perfectly", misconceptionTag: "Only the short horizontal stick gets cut in half. The vertical stick is longer at the bottom!" },
          { label: "D", text: "They are the exact same length", misconceptionTag: "If they were the same length and crossed at 90°, you would have a square, not a kite." }
        ],
        correctAnswer: "B",
        hints: [
          "Think about the wooden frame of a real flying kite. The support sticks form a perfect '+' sign.",
          "While they don't both cut each other in half, they still cross straight up and straight across.",
          "A perfect upright '+' sign means they are perpendicular, crossing at exactly 90°."
        ]
      },
      {
        id: "m4_q5",
        concept: "Rhombus Adjacent Angles",
        text: "A Rhombus is a parallelogram with 4 equal sides. If one angle of a Rhombus is 120°, what is the angle right next to it?",
        options: [
          { label: "A", text: "120°", misconceptionTag: "That would be the OPPOSITE angle. Neighboring angles in a rhombus don't match." },
          { label: "B", text: "90°", misconceptionTag: "The diagonals cross at 90°, but the corner angles of a tilted rhombus are different." },
          { label: "C", text: "60°" },
          { label: "D", text: "180°", misconceptionTag: "180° is the total they add up to, not the single angle." }
        ],
        correctAnswer: "C",
        hints: [
          "Because a Rhombus is still a part of the Parallelogram family, it follows the exact same angle rules.",
          "Adjacent (neighboring) angles must add up to 180° to keep the parallel lines balanced.",
          "180° - 120° = 60°."
        ]
      }
    ]
  },
  {
    id: "module-5-trapezium-hierarchy",
    title: "Trapeziums & Families",
    story: "Shapes have families! A Trapezium is very relaxed—it only needs one pair of lines going in the exact same direction, like the top and bottom of a lamp shade. But a Square is the ultimate rule-follower. It perfectly obeys all the rules of a Rectangle AND a Rhombus at the exact same time!",
    questions: [
      {
        id: "m5_q1",
        concept: "Trapezium Identification",
        text: "Look at the side of a popcorn bucket. The top and bottom are straight and parallel, but the sides lean in. What shape is this?",
        options: [
          { label: "A", text: "Parallelogram", misconceptionTag: "A parallelogram requires BOTH pairs of opposite sides to be parallel." },
          { label: "B", text: "Trapezium" },
          { label: "C", text: "Rhombus", misconceptionTag: "A rhombus has four equal sides and two pairs of parallel lines." },
          { label: "D", text: "Kite", misconceptionTag: "A kite doesn't have parallel lines; it has matching touching lines." }
        ],
        correctAnswer: "B",
        hints: [
          "If the side lines lean in, they will eventually crash into each other. They are not parallel.",
          "A parallelogram is strict and needs two pairs of 'train tracks'. This shape is more relaxed.",
          "A shape with exactly ONE pair of parallel lines is called a Trapezium."
        ]
      },
      {
        id: "m5_q2",
        concept: "Isosceles Trapezium",
        text: "If the two 'leaning' (non-parallel) sides of a trapezium are exactly the same length, what do we call it?",
        options: [
          { label: "A", text: "Regular Trapezium", misconceptionTag: "Regular means all sides and angles are equal. This shape only has two equal sides." },
          { label: "B", text: "Isosceles Trapezium" },
          { label: "C", text: "Rhombus", misconceptionTag: "A rhombus must have ALL four sides equal." },
          { label: "D", text: "Square", misconceptionTag: "A square has four equal sides and four right angles." }
        ],
        correctAnswer: "B",
        hints: [
          "Think of a triangle that has two sides of the same length. What is that called?",
          "When the non-parallel sides match, the shape becomes perfectly symmetrical, just like that special type of triangle.",
          "Matching non-parallel sides makes it an Isosceles Trapezium."
        ]
      },
      {
        id: "m5_q3",
        concept: "Quadrilateral Hierarchy",
        text: "Which shape is so perfect that it belongs to the Rectangle family, the Rhombus family, AND the Parallelogram family?",
        options: [
          { label: "A", text: "Kite", misconceptionTag: "A kite isn't even a parallelogram, so it can't be in the rectangle or rhombus families." },
          { label: "B", text: "Trapezium", misconceptionTag: "A trapezium only has one pair of parallel sides." },
          { label: "C", text: "Square" },
          { label: "D", text: "Hexagon", misconceptionTag: "A hexagon has 6 sides. The families we are talking about are quadrilaterals (4 sides)." }
        ],
        correctAnswer: "C",
        hints: [
          "We need a shape with equal 90° angles (like a rectangle) AND 4 equal sides (like a rhombus).",
          "What is the most 'Regular' 4-sided shape you can think of?",
          "A Square follows every rule, making it the ultimate member of all those shape families."
        ]
      },
      {
        id: "m5_q4",
        concept: "Rectangle vs Square",
        text: "A friend tells you: 'All rectangles are squares.' Are they right or wrong?",
        options: [
          { label: "A", text: "Right, because both have 90° corners.", misconceptionTag: "Having 90° corners is the rule for rectangles, but a square needs something extra." },
          { label: "B", text: "Right, because both have 4 sides.", misconceptionTag: "A lot of shapes have 4 sides without being squares (like kites or trapeziums)." },
          { label: "C", text: "Wrong, because a rectangle doesn't have to have 4 equal sides." },
          { label: "D", text: "Wrong, because a rectangle has no parallel lines.", misconceptionTag: "A rectangle definitely has parallel lines (it's a parallelogram)." }
        ],
        correctAnswer: "C",
        hints: [
          "Think about a very long, skinny TV screen. That is a rectangle. Does it look like a square?",
          "A square has a strict rule: all 4 sides must be equal. A rectangle only requires opposite sides to be equal.",
          "Therefore, a square is a special rectangle, but a normal rectangle is NOT a square."
        ]
      },
      {
        id: "m5_q5",
        concept: "Trapezium Properties",
        text: "Which of the following statements about a Trapezium is TRUE?",
        options: [
          { label: "A", text: "It must have two pairs of parallel sides.", misconceptionTag: "That is the definition of a parallelogram, which is stricter." },
          { label: "B", text: "Its diagonals always bisect each other.", misconceptionTag: "Trapezium diagonals generally do NOT cut each other exactly in half." },
          { label: "C", text: "It only needs exactly ONE pair of parallel sides." },
          { label: "D", text: "All of its angles must add up to 540°.", misconceptionTag: "A trapezium has 4 sides, so its angles add up to 360°." }
        ],
        correctAnswer: "C",
        hints: [
          "Think of a trapezium as a 'half-finished' parallelogram.",
          "Look at the top and bottom of a lamp shade: they never touch. But the sides lean inward and would eventually crash.",
          "A trapezium only has one set of lines that never touch (one pair of parallel sides)."
        ]
      }
    ]
  }
];