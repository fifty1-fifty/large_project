# 🎬 Flicks

**Flicks** is a social media platform for movie lovers. Users can rate and review films, with all activity saved on their personal profiles. The home button allows users to see a carousel view of their friend's most recent movie reviews. The explore button intialiity pulls recent popular movies from The Movie Database (TMBD). Flicks gives you the tools to express your thoughts and discover new favorites.

🔗 **Live Demo:** [http://group22cop4331c.xyz/](http://group22cop4331c.xyz/)

---

## 🚀 Features

- User authentication & profile management  
- Rate movies and write detailed reviews  
- Review history saved on user profiles  
- Search for movies and fellow users  
- View other users’ reviews  
- Integrated with TMDB API for movie data  

---

## 🧱 Tech Stack

- **Frontend:** React + TypeScript + Vite  
- **Backend:** Express, Axios, CORS
- **Database:** MongoDB (Mongoose)  
- **Authentication:** JWT  
- **Email Verification:** SendGrid  
- **API Integration:** TMDB 

---

## ⚙️ Local Seteup


# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
