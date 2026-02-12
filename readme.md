# 🚀 Agentic AI Project (FastAPI + LangGraph + Groq)

An AI-powered agent system built using **FastAPI**, **LangChain**, and **LangGraph**, capable of structured reasoning and tool-based execution.

---

## 📌 Features

- 🔁 Agent-based workflow using LangGraph
- 🧠 LLM integration (Groq / OpenAI compatible)
- 🛠 Tool calling support
- ⚡ FastAPI backend
- 🌍 Modular project structure
- 🔐 Environment-based configuration
- 🎯 Clean separation of prompts, states, and tools

---

## 🏗 Project Structure

agent/
│── graph.py # Agent workflow graph
│── prompts.py # Prompt templates
│── states.py # Agent state definitions
│── tools.py # Tool definitions
│── init.py

frontend/ # (Optional UI layer)
generated_project/ # Auto-generated outputs

main.py # FastAPI entry point
requirements.txt
.gitignore

---

## 🛠 Tech Stack

- Python 3.11+
- FastAPI
- LangChain
- LangGraph
- Groq API
- Pydantic
- Uvicorn

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

###

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 2️⃣ Install dependencies

```bash
pip install -r requirements.txt
```

### 3️⃣ Setup Environment Variables

Create a .env file in the root directory:
GROQ_API_KEY=your_api_key_here

### 4️⃣ Run the application

python main.py

---
