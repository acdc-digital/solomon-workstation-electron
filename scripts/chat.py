import openai

response = openai.completions.create(
    engine="text-davinci-003",
    prompt="What is recursion?",
    max_tokens=100
)
print(response)