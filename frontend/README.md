# Quiz App Frontend

A modern, professional React TypeScript frontend for the Quiz Application.

## Features

- **Test Selection Page**: Choose topic, number of questions, and difficulty level
- **Quiz Interface**: Clean question navigation with progress tracking and overview
- **Results Page**: Comprehensive results display with performance analytics
- **Modern UI**: Built with Tailwind CSS and shadcn/ui components
- **State Management**: Zustand for efficient state management
- **API Integration**: TanStack Query with Axios for API calls
- **Responsive Design**: Mobile-friendly and professional appearance

## Tech Stack

- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **Zustand** for state management
- **TanStack Query** for API calls
- **Axios** for HTTP requests
- **React Router** for navigation
- **Lucide React** for icons

## Project Structure

```
src/
├── components/          # Reusable UI components
│   └── ui/             # shadcn/ui components
├── pages/              # Page components
├── services/           # API services and queries
├── store/              # Zustand store
├── schemas/            # TypeScript types and interfaces
├── utils/              # Utility functions
└── App.tsx             # Main app component
```

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

## API Configuration

The frontend is configured to connect to the backend API at `http://localhost:3000/api`. Make sure your backend server is running on port 3000.

To change the API URL, update the `API_BASE_URL` in `src/services/api.ts`.

## Features Overview

### Test Selection Page
- Topic selection from available topics
- Configurable number of questions (5, 10, 15, 20, 25)
- Difficulty level selection (Easy, Medium, Hard)
- Test summary before starting
- Professional gradient design

### Quiz Interface
- Question-by-question navigation
- Progress bar and completion tracking
- Question overview sidebar with navigation
- Option selection with visual feedback
- Submit confirmation dialog
- Professional layout with responsive design

### Results Page
- Animated score display with circular progress
- Detailed performance statistics
- Performance message based on score
- Achievement badges for high scores
- Option to retake quiz or start new one
- Comprehensive results breakdown

## Styling

The application uses a professional blue gradient theme with:
- Clean typography and spacing
- Consistent color scheme
- Responsive layout
- Smooth animations and transitions
- Professional shadows and borders
- Accessible design patterns

## State Management

The application uses Zustand for state management with the following key features:
- Quiz configuration storage
- Current question tracking
- Answer management
- Progress calculation
- Results storage

## API Integration

TanStack Query is used for:
- Topic fetching with caching
- Quiz starting with mutation
- Quiz submission with loading states
- Error handling and retry logic

## Components

### UI Components (shadcn/ui)
- Button: Customizable buttons with variants
- Card: Content containers with headers and footers
- Select: Dropdown selection components
- Progress: Progress indication (custom)

### Custom Components
- LoadingSpinner: Reusable loading indicator
- Page components: Complete page layouts

All components follow accessibility best practices and are fully responsive.