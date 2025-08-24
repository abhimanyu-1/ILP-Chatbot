# ILP Chatbot (TCS Initial Learning Program)

## 📌 Project Overview & Purpose

The **ILP Chatbot** is an interactive web-based chatbot designed to assist new joiners of the **TCS Initial Learning Program (ILP)**. It helps trainees navigate the program by answering queries, providing guidance on training modules, schedules, and resources. The purpose of this project is to simplify onboarding, reduce manual dependency, and enhance the overall learning experience for associates.

---

## 🛠 Tech Stack & Dependencies

### Frontend

* **React** – UI framework for building interactive components
* **Vite** – Fast bundler & development server
* **Tailwind CSS** – Utility-first CSS framework for styling
* **TypeScript** – Type safety for JavaScript

### Backend/Support

* **Python** – for running helper scripts (`start_dev.py`)
* **Node.js** – package management & runtime

### Dependencies

* Listed in `package.json` & `pnpm-lock.yaml` (examples include ESLint, PostCSS, Autoprefixer, etc.)

---

## ⚙️ Setup & Installation Instructions

### 1. Clone the Repository

```bash
git clone <repo_url>
cd ILPChatbot
```

### 2. Install Dependencies

Using **npm**:

```bash
npm install
```

Or using **pnpm** (if preferred):

```bash
pnpm install
```

### 3. Run Development Server

```bash
npm run dev
```

This will start the Vite dev server, and the app will be accessible in your browser (usually at `http://localhost:5173`).

### 4. (Optional) Python Startup Script

If additional backend setup is needed, run:

```bash
python start_dev.py
```

---

## 🔄 Detailed Working Flow (Step by Step)

1. **Launch Application**
   Start the Vite dev server → Opens chatbot UI in browser.

2. **User Interaction**
   User enters a query related to ILP (e.g., “What is today’s training schedule?”).

3. **Chatbot Processing**

   * Input is passed through frontend components.
   * If integrated with backend/knowledge base, query is processed.
   * A response is generated (static/dynamic based on configuration).

4. **Response Display**
   The chatbot displays the answer in a conversational format.

5. **Repeat Interaction**
   User can continue asking questions seamlessly.

---

## 💡 Example Use Cases & Impact

* **Trainees** → Get instant answers on ILP modules, schedules, policies.
* **HR/Faculty Support** → Reduce repetitive queries and improve efficiency.
* **Onboarding** → Helps new joiners settle quickly by providing program-related information.
* **Future Expansion** → Can integrate with TCS portals/APIs for real-time updates.

---

## 🚀 Impact

This project demonstrates how a chatbot can streamline **corporate onboarding**, enhance the **training experience** for associates, and reduce manual dependency for mentors and HR coordinators.
