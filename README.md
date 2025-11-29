# 🚀 NexGen Labs - Chatbot Platform (Hackathon 2025)

## ✨ Fonctionnalités implémentées

### 🎯 **Chatbot Interactif Frontend**
- **Widget de chat moderne** avec design futuriste
- **Réponses intelligentes** pré-programmées selon le contexte
- **Animation fluides** et transitions élégantes  
- **Responsive design** - fonctionne sur mobile/tablette/desktop
- **Réponses rapides** avec boutons prédéfinis
- **Indicateur de frappe** en temps réel
- **Formatage des messages** (gras, italique, code, liens)

### 🎨 **Interface Utilisateur**
- **Page d''accueil** avec hero section attrayante
- **Page de création** avec guide étape par étape
- **Documentation complète** avec exemples de code
- **Design sombre futuriste** avec gradients
- **Bouton flottant** 💬 pour ouvrir le chat
- **Navigation responsive** avec animations

### 🔧 **Fonctionnalités Techniques**
- **ASP.NET Core 9** avec Razor Pages
- **CSS moderne** avec variables personnalisées
- **JavaScript ES6+** avec classes et modules
- **Gestion d''événements** personnalisés
- **Accessibilité** (ARIA labels, navigation clavier)
- **Performance optimisée** avec animations GPU

### 💬 **Capacités du Chatbot**
Le chatbot peut répondre à des questions sur :
- 🛠️ **Services** - Présentation des solutions NexGen
- 💰 **Tarifs** - Plans Starter (29€), Pro (79€), Enterprise
- 🎮 **Démonstrations** - Showcase interactif
- 🔧 **Support technique** - Aide à l''intégration
- 📞 **Contact** - Informations de contact
- 🚀 **Création** - Guide pour créer un chatbot
- 🎯 **Aide contextuelle** selon la page visitée

### 📱 **Responsive & Accessibilité**
- **Mobile-first** design approach
- **Touch-friendly** interactions
- **Keyboard navigation** support
- **Screen readers** compatibility
- **Reduced motion** support
- **High contrast** mode

## 🎯 **Comment tester le chatbot**

1. **Lancez l''application** : `dotnet run --urls http://localhost:5000`
2. **Cliquez sur le bouton 💬** en bas à droite
3. **Testez les réponses rapides** ou tapez vos questions
4. **Naviguez entre les pages** pour voir les réponses contextuelles

### 🗣️ **Exemples de questions à poser :**
- "Bonjour"
- "Quels sont vos services ?"
- "Combien ça coûte ?"
- "Je veux créer un chatbot"
- "Comment l''intégrer sur mon site ?"
- "Vos horaires ?"
- "Comment vous contacter ?"

## 🛠️ **Architecture**

```
📁 Pages/
  ├── Index.cshtml (Page d''accueil avec démo)
  ├── Create.cshtml (Guide de création)
  ├── Docs.cshtml (Documentation)
  └── Shared/_Layout.cshtml (Template principal)

📁 wwwroot/
  ├── css/
  │   ├── site.css (Styles principaux)
  │   └── chatbot.css (Styles du chat)
  └── js/
      ├── chatbot.js (Intelligence du bot)
      └── index-page.js (Interactions page d''accueil)
```

## 🎨 **Design System**

- **Couleurs principales** : Violet (#7c3aed) et Cyan (#06b6d4)
- **Typography** : Inter (Google Fonts)
- **Spacing** : Échelle 8px (8, 16, 24, 32...)
- **Border radius** : 8px, 16px, 24px pour différents éléments
- **Animations** : Cubic-bezier pour des transitions naturelles

## 🚀 **Améliorations futures possibles**

1. **Backend Integration** - Connexion avec une vraie IA
2. **Authentification** - Comptes utilisateurs
3. **Analytics** - Statistiques des conversations
4. **Multi-langue** - Support de plusieurs langues
5. **Thèmes** - Mode clair/sombre personnalisable
6. **Export** - Sauvegarde des conversations

---

**Développé pour le Hackathon 2025** ✨  
*Démonstration d''un chatbot frontend sans backend*
