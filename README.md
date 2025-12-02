<a align="center" href="https://agentic-task-manager.vercel.app/" target="_blank" >
  <img src="https://agentic-task-manager.vercel.app/images/appImage.png" width="100%" alt="Task Manager Hero" />
</a>

# 📝 Task Manager – App + WhatsApp Powered Productivity Tool

**Task Manager** is a modern, lightweight productivity application built with **Next.js**, allowing users to **create, update, and organize tasks or notes from the web app or directly through WhatsApp**.  
It is designed for simplicity, speed, and seamless accessibility—whether you're on desktop, mobile, or on the go via WhatsApp.

Live Website: **https://agentic-task-manager.vercel.app**

---

## 🚀 Features

### ✅ Task & Notes Management
- Create, edit, and delete tasks  
- Add notes, tags, due dates, and reminders  
- Auto-default reminder time (09:00 AM) if only date is provided  
- Mark tasks as completed  

### 💬 WhatsApp Integration
- Create tasks directly by messaging your WhatsApp bot  
- Real-time syncing between WhatsApp and web app  
- Natural-text parsing for titles, reminders, and notes  
- Confirmation messages sent instantly  

### ⚡ Productivity Enhancers
- Real-time home page updates  
- Tag-based grouping  
- Search & filter options  
- Clean, modern, responsive UI  
- Smooth mobile experience  

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js |
| Language | TypeScript |
| Styling | TailwindCSS |
| Database | MongoDB |
| WhatsApp | Twilio WhatsApp API |
| Deployment | Vercel |
| State/Updates | Polling / API-driven refresh |

---

## 📐 Architecture Overview
                      ┌─────────────────────────────┐
                      │           Web App           │
                      │   (Next.js + API Routes)    │
                      └───────────────┬─────────────┘
                                      │
                                      │ CRUD Operations
                                      │
                           ┌──────────┴──────────┐
                           │     MongoDB DB      │
                           └──────────┬──────────┘
                                      │
                                      │
                   ┌──────────────────┴──────────────────┐
                   │        Twilio WhatsApp Bot          │
                   │   User Message → Webhook → Task     │
                   └─────────────────────────────────────┘

---

## 💬 WhatsApp Flow

1. User sends a message to WhatsApp bot  
2. Twilio forwards message to your Next.js webhook  
3. Backend extracts title, body, tags, reminder using OpenAI GPT-4o mini llm model
4. Task is created in MongoDB  
5. Bot sends confirmation message  
6. Task appears in UI instantly  

---

### 📄 License
Licensed under MIT License.

### ⭐ Support
If this project helps you, please give it a star ⭐ on GitHub!

## 🤝Connect me on:
[![email](https://img.shields.io/badge/Email-D14836?logo=gmail&logoColor=white)](mailto:sahillokhande94@gmail.com) [![LinkedIn](https://img.shields.io/badge/LinkedIn-%230077B5.svg?logo=linkedin&logoColor=white)](https://linkedin.com/in/sahillokhande26) [![Instagram](https://img.shields.io/badge/Instagram-%23E4405F.svg?logo=Instagram&logoColor=white)](https://instagram.com/sahil_lokhande26) [![X](https://img.shields.io/badge/X-black.svg?logo=X&logoColor=white)](https://x.com/sahillokhande26)
