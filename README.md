# My Portfolio

A professional portfolio website showcasing my experience, projects, certifications, and technical expertise.

## About

Welcome to my personal portfolio! This site highlights my professional journey, technical skills, and past projects in cybersecurity and software development.

## Features

- **Professional Design**: Clean and modern UI with dark/light theme support
- **Responsive Layout**: Fully responsive design for all devices
- **Interactive Components**: Smooth animations and transitions
- **Contact Form**: Direct email integration for inquiries
- **Experience Timeline**: Detailed work experience and internships
- **Project Showcase**: Portfolio of completed projects
- **Certifications**: Display of professional certifications

## Technology Stack

- **Frontend Framework**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn-ui
- **Email Service**: EmailJS
- **Validation**: Zod
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js (v16 or higher) - [Install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- npm or bun package manager

### Installation

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd kyuby-bytes-portfolio

# Install dependencies
npm install
# or
bun install
```

### Development

```sh
# Start the development server
npm run dev
# or
bun dev
```

The application will be available at `http://localhost:8080`

## Deployment

To build the project for production:

```sh
npm run build
# or
bun run build
```

The optimized build will be in the `dist` directory.

## Project Structure

```
src/
├── components/          # React components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── App.tsx             # Main app component
└── main.tsx            # Entry point

public/
├── data/               # JSON data files
└── assets/             # Images and media files
```

## Configuration

### Environment Variables

Create a `.env.local` file in the root directory (if needed):

```
VITE_API_URL=your_api_url
```

### Customization

- Update portfolio data in `public/data/` JSON files
- Modify styling in `src/App.css` and `src/index.css`
- Customize components in `src/components/`

## Contact

For inquiries or collaboration opportunities, please visit the contact section or reach out via:
- Email: yassine_hallous@ieee.org
- GitHub: [Hallous-Yassine](https://github.com/Hallous-Yassine)
- LinkedIn: [yassine-hallous](https://linkedin.com/in/yassine-hallous)

## License

[link]

## Author

Yassine Hallous

---

Built with passion and modern web technologies.
