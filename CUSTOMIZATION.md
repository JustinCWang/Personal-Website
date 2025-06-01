# Landing Page Customization Guide

Your personal website now has a beautiful landing page! Here's how to customize it with your personal information.

## 🎨 Personalizing Your Landing Page

### 1. **Update Personal Information**

Open `frontend/src/components/LandingPage.tsx` and modify the `PERSONAL_INFO` object:

```typescript
const PERSONAL_INFO = {
  name: "Your Actual Name",           // Replace with your name
  title: "Your Professional Title",   // e.g., "Full Stack Developer", "Software Engineer"
  bio: "Your personal bio...",        // 1-2 sentences about yourself
  image: "/path/to/your/photo.jpg",   // Path to your profile photo
  hobbies: [
    "🎵 Your Hobby 1",
    "📚 Your Hobby 2", 
    "🎮 Your Hobby 3",
    // Add your actual hobbies with emojis
  ],
  skills: [
    "React", "Your", "Actual", "Skills", "Here"
    // Add your real tech skills
  ],
  social: {
    github: "https://github.com/yourusername",
    linkedin: "https://linkedin.com/in/yourprofile",
    email: "your.actual.email@domain.com"
  }
}
```

### 2. **Adding Your Profile Photo**

1. **Option A: Local Image**
   - Add your photo to `frontend/public/images/profile.jpg`
   - Update the image path: `image: "/images/profile.jpg"`

2. **Option B: External URL**
   - Upload your photo to a service like Imgur, Cloudinary, or your own hosting
   - Use the direct URL: `image: "https://your-image-url.com/photo.jpg"`

### 3. **Customizing Colors and Styling**

The landing page uses CSS classes that you can customize in your main CSS file:

```css
/* Add to your global CSS or create a custom.css file */

/* Primary color customization */
.bg-primary-600 { background-color: #your-color; }
.text-primary-600 { color: #your-color; }
.border-primary-600 { border-color: #your-color; }

/* Gradient customization */
.bg-gradient-to-r.from-primary-600.to-purple-600 {
  background: linear-gradient(to right, #your-color, #your-secondary-color);
}
```

### 4. **Managing Featured Projects**

To feature projects on your landing page:

1. **Login to your admin dashboard**
2. **Create or edit a project**
3. **Check the "Feature this project on landing page" checkbox**
4. **Save the project**

The project will automatically appear in the "Featured Projects" section!

## 🚀 Advanced Customization

### Adding New Sections

You can add new sections to the landing page by editing `LandingPage.tsx`:

```typescript
{/* Add after existing sections */}
<section className="py-16 px-6 bg-white">
  <div className="max-w-6xl mx-auto">
    <h2 className="text-3xl font-bold text-slate-800 mb-12 text-center">
      Your New Section
    </h2>
    {/* Your custom content */}
  </div>
</section>
```

### Customizing the Hero Section

```typescript
// In the hero section, you can modify:
<h2 className="text-5xl font-bold text-slate-800 mb-4">
  Your Custom Headline
</h2>
```

### Adding More Social Links

```typescript
social: {
  github: "https://github.com/yourusername",
  linkedin: "https://linkedin.com/in/yourprofile", 
  email: "your.email@example.com",
  twitter: "https://twitter.com/yourusername",    // Add new
  website: "https://yourwebsite.com",            // Add new
  youtube: "https://youtube.com/yourchannel"     // Add new
}
```

Then add the corresponding buttons in the JSX.

## 📱 Mobile Responsiveness

The landing page is fully responsive and will look great on:
- ✅ Desktop computers
- ✅ Tablets 
- ✅ Mobile phones

## 🎯 SEO Optimization

Consider adding:

1. **Meta tags** in `index.html`:
```html
<meta name="description" content="Your professional portfolio description">
<meta name="keywords" content="your, relevant, keywords">
<meta property="og:title" content="Your Name - Professional Portfolio">
<meta property="og:description" content="Your bio">
<meta property="og:image" content="link-to-your-photo">
```

2. **Structured data** for better search engine understanding

## 🛠 Development Tips

### Testing Your Changes

1. Save your changes to `LandingPage.tsx`
2. The page will auto-reload
3. Check both desktop and mobile views
4. Test all links and functionality

### Performance

- Optimize your profile image (recommended: 400x400px, under 100KB)
- Use WebP format for better compression
- Consider lazy loading for better performance

## 🌟 Going Live

When you're ready to deploy:

1. **Update all placeholder content** with your real information
2. **Test the featured projects functionality**
3. **Verify all social links work**
4. **Check mobile responsiveness**
5. **Deploy using your preferred platform** (Vercel, Netlify, etc.)

Your landing page is now a professional portfolio that showcases your work and personality! 🚀

## Need Help?

If you need assistance with customization:
1. Check the browser console for any errors
2. Make sure your image paths are correct
3. Verify your social links are valid URLs
4. Test the featured projects functionality by logging in

Happy customizing! ✨ 