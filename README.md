# 🚀 Space Airplane Alien Game

An exciting space shooter game built with React, TypeScript, and Vite! Control your spaceship, battle alien invaders, and achieve the highest score possible.

## 🎮 Game Features

- **Player-controlled spaceship** with smooth keyboard controls
- **Dynamic alien enemies** that spawn and move across the screen
- **Shooting mechanics** with glowing projectiles
- **Collision detection** between bullets and aliens
- **Health system** with visual health bars
- **Score tracking** and level progression
- **Game over/restart functionality**
- **Pause/resume capability**
- **Modern UI** with CSS animations and space-themed effects
- **Responsive design** that works on different screen sizes

## 🎯 How to Play

### Controls
- **Movement**: `WASD` keys or Arrow keys
- **Shoot**: `Spacebar`
- **Pause**: `P` key

### Objective
- Destroy alien ships to earn points
- Avoid collisions with aliens (they damage your health)
- Survive as long as possible and achieve high scores
- Progress through levels as your score increases

### Scoring System
- Small aliens: 10 points
- Medium aliens: 25 points  
- Large aliens: 50 points

## 🛠️ Development

This project uses React + TypeScript + Vite for optimal development experience.

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd game-fly

# Install dependencies
npm install
```

### Running the Game

```bash
# Start development server
npm run dev
```

Open your browser and navigate to `http://localhost:5173` to play the game!

### Building for Production

```bash
# Build the project
npm run build

# Preview the build
npm run preview
```

### Code Quality Tools

This project is configured with ESLint and Prettier for code linting and formatting.

#### ESLint

To run ESLint, use the following command:

```bash
npm run lint
```

To fix linting errors automatically, you can run:

```bash
npm run lint:fix
```

#### Prettier

To format the code with Prettier, use the command:

```bash
npm run format
```

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── Game.tsx        # Main game component with game loop
│   ├── Spaceship.tsx   # Player spaceship component
│   ├── AlienShip.tsx   # Alien enemy component
│   ├── Bullet.tsx      # Projectile component
│   └── GameUI.tsx      # UI overlay component
├── types/
│   └── game.ts         # TypeScript type definitions
├── utils/
│   └── gameLogic.ts    # Game mechanics and utilities
└── main.tsx           # Application entry point
```

## 🎨 Technical Features

- **60 FPS gameplay** using `requestAnimationFrame`
- **Modular component architecture** for easy maintenance
- **TypeScript** for type safety and better development experience
- **CSS animations** and effects for engaging visuals
- **Responsive design** with scaling for different screen sizes
- **Clean separation** of game logic and presentation

## 🚀 Future Enhancements

- Sound effects and background music
- Power-ups and special weapons
- Different alien types with unique behaviors
- Boss battles
- Multiplayer support
- Leaderboards

## 📝 License

This project is open source and available under the MIT License.

---

Enjoy playing the Space Airplane Alien Game! 🎮✨
