# Recipe Creator AI

A web application that generates custom recipes based on your ingredients and dietary preferences using AI.

## Features

- Generate recipes based on available ingredients
- Customize recipes based on dietary preferences (vegetarian, vegan, gluten-free, etc.)
- Specify cuisine type (Italian, Mexican, Indian, etc.)
- Choose meal type (breakfast, lunch, dinner, etc.)
- Add additional preferences or restrictions
- Option for quick meals (30 minutes or less)
- Detailed recipe output with:
  - Ingredients with measurements
  - Step-by-step instructions
  - Preparation and cooking time
  - Servings
  - Tags
  - Nutritional information
  - Cooking tips

## Technologies Used

- Next.js 14
- React
- TypeScript
- Tailwind CSS
- OpenAI API
- AI SDK

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn
- OpenAI API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/recipe-creator-ai.git
   cd recipe-creator-ai
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1. Enter the ingredients you have available, separated by commas.
2. Select your dietary preferences, cuisine type, and meal type.
3. Add any additional preferences or restrictions.
4. Check the "Quick Meal" option if you want a recipe that can be prepared in 30 minutes or less.
5. Click "Generate Recipe" to create a custom recipe based on your inputs.
6. View the generated recipe with detailed instructions, ingredients, and nutritional information.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 