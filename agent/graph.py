from langchain import *
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from agent.prompts import *
from langgraph.graph import StateGraph,START,END
from langgraph.constants import END 
from agent.tools import *
from langchain.agents import create_agent

load_dotenv()
model = ChatGroq(
    model="openai/gpt-oss-120b",
    temperature=0.3
)



def planner_agent(state: dict) -> dict:
    user_Prompt = state['user_Prompt']
    mainprompt = planner_prompt()
    structured_llm = model.with_structured_output(Plan)
    chain = mainprompt | structured_llm
    parsed = chain.invoke({"user_Prompt": user_Prompt})
    return {"plan": parsed}

def architect_agent(state: dict) -> dict:
    plan = state['plan']
    mainprompt = architect_prompt()
    structured_llm = model.with_structured_output(TaskPlan)
    chain = mainprompt | structured_llm
    parsed = chain.invoke({"plan": plan})
    parsed.plan = plan
    return {"task_plan": parsed}

def coder_agent(state: dict) -> dict:
    """LangGraph tool-using coder agent."""
    coder_state: CoderState = state.get("coder_state")
    if coder_state is None:
        coder_state = CoderState(task_plan=state["task_plan"], current_step_idx=0)

    steps = coder_state.task_plan.implementation_steps
    if coder_state.current_step_idx >= len(steps):
        return {"coder_state": coder_state, "status": "DONE"}

    current_task = steps[coder_state.current_step_idx]
    existing_content = read_file.run(current_task.filepath)

    system_prompt = coder_system_prompt()
    user_prompt = (
        f"Task: {current_task.task_description}\n"
        f"File: {current_task.filepath}\n"
        f"Existing content:\n{existing_content}\n"
        "Use write_file(path, content) to save your changes."
    )

    coder_tools = [read_file, write_file, list_files, get_current_directory]
    react_agent = create_agent(model, coder_tools)

    react_agent.invoke({"messages": [{"role": "system", "content": system_prompt},
                                     {"role": "user", "content": user_prompt}]})

    coder_state.current_step_idx += 1
    return {"coder_state": coder_state}



graph = StateGraph(dict)
graph.add_node("planner", planner_agent)
graph.add_node("architect", architect_agent)
graph.add_node("coder", coder_agent)
graph.add_edge("planner","architect")
graph.add_edge("architect",'coder')
graph.add_conditional_edges(
    "coder",
    lambda s: "END" if s.get("status") == "DONE" else "coder",
    {"END": END, "coder": "coder"}
)
graph.set_entry_point("planner")

agent = graph.compile()

if __name__ == "__main__":
    result = agent.invoke({"user_Prompt": userPrompt},{"recursion_limit":100})
    print(result)




