# Solution Docs

+ We need a select with 2 input types:
+	1 array
+	2 url - https://api.github.com/search/users?q={query}&per_page={numOfResults} 

+ onSelect should return user ID when url is github url.
+ This component cant use both array and url.
+ This component must be reusable.
+ First example should works fine as it is working fine.
+ After onSelect triggered that Item should replace in input.
Up/Down keys should works for select between options and enter should trigger onSelect.

+ New APIs and your notes should be documented in SOLUTION.md.

Next steps:
	handle ajax error 
	create loading if server response is not fast