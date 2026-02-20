from langchain_core.prompts import PromptTemplate

from agent.states import *

userPrompt = 'generate a simple calculator web application'
def planner_prompt():
    mainprompt = PromptTemplate(
    template="""
    You are a PLANNER Agent. Convert the user Prompt into a full engineering project plan.

    User Request: {user_Prompt}
    """
    ,
    input_variables=["user_Prompt"],
    )
    return mainprompt

def architect_prompt():
    mainprompt = PromptTemplate(
        template="""
You are the ARCHITECT agent. Given this project plan, break it down into explicit engineering tasks.

RULES:
- For each FILE in the plan, create one or more IMPLEMENTATION TASKS.
- In each task description:
    * Specify exactly what to implement.
    * Name the variables, functions, classes, and components to be defined.
    * Mention how this task depends on or will be used by previous tasks.
    * Include integration details: imports, expected function signatures, data flow.
- Order tasks so that dependencies are implemented first.
- Each step must be SELF-CONTAINED but also carry FORWARD the relevant context from earlier tasks.

Project Plan: {plan}
    """,
    input_variables=["plan"],
    )
    return mainprompt

def coder_system_prompt() -> str:
    CODER_SYSTEM_PROMPT = """
    You are the CODER agent.
    You are implementing a specific engineering task.
    You must use the provided tools to complete the task.

    RULES:
    - Use the `read_file` or `list_files` tools to understand the project structure if needed.
    - ALWAYS use the `write_file` tool to save your work.
    - Implement the FULL file content as requested by the task.
    - Maintain consistent names and ensure imports are correct based on your research.
    - Focus on completing the specific task described.
    """
    return CODER_SYSTEM_PROMPT