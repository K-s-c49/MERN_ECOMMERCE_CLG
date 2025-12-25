# Contributing to MERN E-Commerce Project

Thank you for your interest in contributing to this MERN E-Commerce college project!

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- Git
- Code editor (VS Code recommended)

### Setup Instructions
1. Clone the repository
   ```bash
   git clone https://github.com/K-s-c49/MERN_ECOMMERCE_CLG.git
   cd MERN_ECOMMERCE_CLG
   ```

2. Install dependencies (once project structure is set up)
   ```bash
   # Backend
   cd backend
   npm install
   
   # Frontend
   cd ../frontend
   npm install
   ```

3. Set up environment variables
   - Copy `.env.example` to `.env`
   - Fill in required credentials

4. Start development servers
   ```bash
   # Backend
   npm run dev
   
   # Frontend (in another terminal)
   npm start
   ```

## Development Workflow

### Branching Strategy
- `main` - Production-ready code
- `develop` - Development branch
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `hotfix/*` - Urgent production fixes

### Making Changes

1. **Create a new branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow the coding standards below
   - Write clear, concise code
   - Add comments for complex logic

3. **Test your changes**
   - Test locally before committing
   - Ensure no existing functionality breaks

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add user authentication"
   ```

5. **Push to repository**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Provide a clear description
   - Reference any related issues
   - Wait for review

## Coding Standards

### General Guidelines
- Write clean, readable code
- Use meaningful variable and function names
- Keep functions small and focused
- Don't repeat yourself (DRY principle)
- Comment complex logic

### JavaScript/Node.js
- Use `const` and `let`, avoid `var`
- Use arrow functions where appropriate
- Use async/await instead of callbacks
- Handle errors properly
- Use meaningful error messages

### React
- Use functional components with hooks
- Keep components small and reusable
- Use descriptive component names (PascalCase)
- Manage state appropriately
- Avoid inline styles when possible

### Git Commit Messages
Follow conventional commit format:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Examples:
```
feat: add user registration endpoint
fix: resolve cart total calculation error
docs: update API documentation
```

## Project Structure (Planned)

```
MERN_ECOMMERCE_CLG/
├── backend/
│   ├── config/         # Configuration files
│   ├── controllers/    # Route controllers
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── middleware/     # Custom middleware
│   ├── utils/          # Utility functions
│   └── server.js       # Entry point
├── frontend/
│   ├── public/         # Static files
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── pages/      # Page components
│   │   ├── context/    # Context API
│   │   ├── utils/      # Utility functions
│   │   └── App.js      # Main component
│   └── package.json
├── docs/               # Additional documentation
└── README.md
```

## Code Review Process

### For Contributors
- Respond to feedback promptly
- Make requested changes
- Keep PR scope focused

### For Reviewers
- Be constructive and respectful
- Test the changes locally
- Check for code quality and standards
- Verify documentation is updated

## Reporting Issues

When reporting bugs or requesting features:
1. Check if issue already exists
2. Use issue templates (when available)
3. Provide clear description
4. Include steps to reproduce (for bugs)
5. Add screenshots if relevant

## Getting Help

- Check documentation first
- Review existing issues
- Ask questions in discussions
- Reach out to project maintainers

## Resources

### Learning Resources
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Node.js Documentation](https://nodejs.org/docs/)

### Tools
- [Postman](https://www.postman.com/) - API testing
- [MongoDB Compass](https://www.mongodb.com/products/compass) - Database GUI
- [VS Code Extensions](https://code.visualstudio.com/) - ESLint, Prettier

## License

This is a college project for educational purposes.

## Questions?

Feel free to reach out to the project maintainer or create a discussion thread.

---

Thank you for contributing to this project! 🚀
