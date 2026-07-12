import json
from sqlalchemy.orm import Session
from app.models.problem import Problem
from app.models.contest import Contest
from datetime import datetime, timedelta

def seed_problems(db: Session):
    if db.query(Problem).count() > 0:
        return
        
    problems_data = [
        {
            "title": "Two Sum",
            "description": "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.\n\n### Example 1\n**Input:** `nums = [2,7,11,15], target = 9`\n**Output:** `[0,1]`\n\n### Example 2\n**Input:** `nums = [3,2,4], target = 6`\n**Output:** `[1,2]`",
            "difficulty": "Easy",
            "tags": "Array, Hash Table",
            "company_tags": "Google, Amazon, Meta, Microsoft",
            "time_limit": 1.0,
            "memory_limit": 128,
            "test_cases": json.dumps([
                {"input": "[2,7,11,15]\n9", "output": "[0,1]"},
                {"input": "[3,2,4]\n6", "output": "[1,2]"},
                {"input": "[3,3]\n6", "output": "[0,1]"}
            ]),
            "starter_code": json.dumps({
                "python": "def twoSum(nums, target):\n    # Write code here\n    pass",
                "javascript": "function twoSum(nums, target) {\n    // Write code here\n}",
                "cpp": "class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        \n    }\n};"
            }),
            "editorial": "The optimal solution is to use a Hash Map. Keep track of the complement (target - nums[i]) and check if it's already in the hash map. Time Complexity: O(N), Space Complexity: O(N)."
        },
        {
            "title": "Valid Parentheses",
            "description": "Given a string `s` containing just the characters `'('`, `')'`, `'{'`, `'}'`, `'['` and `']'`, determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n\n### Example 1\n**Input:** `s = \"()\"`\n**Output:** `true`\n\n### Example 2\n**Input:** `s = \"()[]{}\"`\n**Output:** `true`\n\n### Example 3\n**Input:** `s = \"(]\"`\n**Output:** `false`",
            "difficulty": "Easy",
            "tags": "String, Stack",
            "company_tags": "Meta, Google, Netflix, Microsoft",
            "time_limit": 1.0,
            "memory_limit": 128,
            "test_cases": json.dumps([
                {"input": "\"()\"", "output": "true"},
                {"input": "\"()[]{}\"", "output": "true"},
                {"input": "\"(]\"", "output": "false"},
                {"input": "\"([)]\"", "output": "false"}
            ]),
            "starter_code": json.dumps({
                "python": "def isValid(s):\n    # Write code here\n    pass",
                "javascript": "function isValid(s) {\n    // Write code here\n}",
                "cpp": "class Solution {\npublic:\n    bool isValid(string s) {\n        \n    }\n};"
            }),
            "editorial": "Use a Stack. Iterate over characters: push open brackets, pop and check matching character for closed brackets. If stack is empty at end, return true. Time Complexity: O(N), Space Complexity: O(N)."
        },
        {
            "title": "Merge Two Sorted Lists",
            "description": "You are given the heads of two sorted linked lists `list1` and `list2`.\n\nMerge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists.\n\nReturn the head of the merged linked list.",
            "difficulty": "Easy",
            "tags": "Linked List, Recursion",
            "company_tags": "Amazon, Adobe, Microsoft",
            "time_limit": 1.0,
            "memory_limit": 128,
            "test_cases": json.dumps([
                {"input": "[1,2,4]\n[1,3,4]", "output": "[1,1,2,3,4,4]"},
                {"input": "[]\n[]", "output": "[]"},
                {"input": "[]\n[0]", "output": "[0]"}
            ]),
            "starter_code": json.dumps({
                "python": "# Definition for singly-linked list.\n# class ListNode:\n#     def __init__(self, val=0, next=None):\n#         self.val = val\n#         self.next = next\ndef mergeTwoLists(list1, list2):\n    # Write code here\n    pass",
                "javascript": "function mergeTwoLists(list1, list2) {\n    // Write code here\n}",
                "cpp": "class Solution {\npublic:\n    ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {\n        \n    }\n};"
            }),
            "editorial": "Use recursion or an iterative pointer approach. Traverse both lists and attach the smaller value to the merged list. Time Complexity: O(N + M), Space Complexity: O(1)."
        },
        {
            "title": "Reverse String",
            "description": "Write a function that reverses a string. The input string is given as an array of characters `s`.\n\nYou must do this by modifying the input array in-place with O(1) extra memory.",
            "difficulty": "Easy",
            "tags": "Two Pointers, String",
            "company_tags": "Microsoft, Amazon, Meta",
            "time_limit": 1.0,
            "memory_limit": 128,
            "test_cases": json.dumps([
                {"input": "[\"h\",\"e\",\"l\",\"l\",\"o\"]", "output": "[\"o\",\"l\",\"l\",\"e\",\"h\"]"},
                {"input": "[\"H\",\"a\",\"n\",\"n\",\"a\",\"h\"]", "output": "[\"h\",\"a\",\"n\",\"n\",\"a\",\"H\"]"}
            ]),
            "starter_code": json.dumps({
                "python": "def reverseString(s):\n    # Modify s in-place\n    pass",
                "javascript": "function reverseString(s) {\n    // Modify s in-place\n}",
                "cpp": "class Solution {\npublic:\n    void reverseString(vector<char>& s) {\n        \n    }\n};"
            }),
            "editorial": "Use two pointers, one at the start and one at the end. Swap characters and move pointers towards each other until they meet. Time Complexity: O(N), Space Complexity: O(1)."
        },
        {
            "title": "Fizz Buzz",
            "description": "Given an integer `n`, return a string array answer (1-indexed) where:\n- `answer[i] == \"FizzBuzz\"` if `i` is divisible by 3 and 5.\n- `answer[i] == \"Fizz\"` if `i` is divisible by 3.\n- `answer[i] == \"Buzz\"` if `i` is divisible by 5.\n- `answer[i] == i` (as a string) if none of the above conditions are true.",
            "difficulty": "Easy",
            "tags": "Math, Simulation",
            "company_tags": "Goldman Sachs, TCS, Infosys",
            "time_limit": 1.0,
            "memory_limit": 128,
            "test_cases": json.dumps([
                {"input": "3", "output": "[\"1\",\"2\",\"Fizz\"]"},
                {"input": "5", "output": "[\"1\",\"2\",\"Fizz\",\"4\",\"Buzz\"]"},
                {"input": "15", "output": "[\"1\",\"2\",\"Fizz\",\"4\",\"Buzz\",\"Fizz\",\"7\",\"8\",\"Fizz\",\"Buzz\",\"11\",\"Fizz\",\"13\",\"14\",\"FizzBuzz\"]"}
            ]),
            "starter_code": json.dumps({
                "python": "def fizzBuzz(n):\n    # Write code here\n    pass",
                "javascript": "function fizzBuzz(n) {\n    // Write code here\n}",
                "cpp": "class Solution {\npublic:\n    vector<string> fizzBuzz(int n) {\n        \n    }\n};"
            }),
            "editorial": "Loop from 1 to n. Check divisibility by 15 (FizzBuzz), 3 (Fizz), or 5 (Buzz). Otherwise add string value of the number. Time: O(N), Space: O(1)."
        },
        {
            "title": "Longest Substring Without Repeating Characters",
            "description": "Given a string `s`, find the length of the longest substring without repeating characters.\n\n### Example\n**Input:** `s = \"abcabcbb\"`\n**Output:** `3`\n**Explanation:** The answer is \"abc\", with the length of 3.",
            "difficulty": "Medium",
            "tags": "Hash Table, String, Sliding Window",
            "company_tags": "Google, Amazon, Microsoft, Meta, Adobe",
            "time_limit": 1.0,
            "memory_limit": 128,
            "test_cases": json.dumps([
                {"input": "\"abcabcbb\"", "output": "3"},
                {"input": "\"bbbbb\"", "output": "1"},
                {"input": "\"pwwkew\"", "output": "3"}
            ]),
            "starter_code": json.dumps({
                "python": "def lengthOfLongestSubstring(s):\n    # Write code here\n    pass",
                "javascript": "function lengthOfLongestSubstring(s) {\n    // Write code here\n}",
                "cpp": "class Solution {\npublic:\n    int lengthOfLongestSubstring(string s) {\n        \n    }\n};"
            }),
            "editorial": "Use sliding window with two pointers. Store the characters in a hash map with their last seen indices. Slide the window and calculate maxLength. Time: O(N), Space: O(min(M, N))."
        },
        {
            "title": "Container With Most Water",
            "description": "You are given an integer array `height` of length `n`. There are `n` vertical lines drawn such that the two endpoints of the `i`th line are `(i, 0)` and `(i, height[i])`.\n\nFind two lines that together with the x-axis form a container, such that the container contains the most water.\n\nReturn the maximum amount of water a container can store.",
            "difficulty": "Medium",
            "tags": "Array, Two Pointers, Greedy",
            "company_tags": "Google, Amazon, Flipkart, Goldman Sachs",
            "time_limit": 1.0,
            "memory_limit": 128,
            "test_cases": json.dumps([
                {"input": "[1,8,6,2,5,4,8,3,7]", "output": "49"},
                {"input": "[1,1]", "output": "1"}
            ]),
            "starter_code": json.dumps({
                "python": "def maxArea(height):\n    # Write code here\n    pass",
                "javascript": "function maxArea(height) {\n    // Write code here\n}",
                "cpp": "class Solution {\npublic:\n    int maxArea(vector<int>& height) {\n        \n    }\n};"
            }),
            "editorial": "Use two pointers, one at the beginning and one at the end. Calculate current area, update max area, and move the pointer pointing to the smaller height inward. Time: O(N), Space: O(1)."
        },
        {
            "title": "Three Sum",
            "description": "Given an integer array nums, return all the triplets `[nums[i], nums[j], nums[k]]` such that `i != j`, `i != k`, and `j != k`, and `nums[i] + nums[j] + nums[k] == 0`.\n\nNotice that the solution set must not contain duplicate triplets.",
            "difficulty": "Medium",
            "tags": "Array, Two Pointers, Sorting",
            "company_tags": "Meta, Google, Microsoft, Adobe",
            "time_limit": 1.0,
            "memory_limit": 128,
            "test_cases": json.dumps([
                {"input": "[-1,0,1,2,-1,-4]", "output": "[[-1,-1,2],[-1,0,1]]"},
                {"input": "[0,1,1]", "output": "[]"},
                {"input": "[0,0,0]", "output": "[[0,0,0]]"}
            ]),
            "starter_code": json.dumps({
                "python": "def threeSum(nums):\n    # Write code here\n    pass",
                "javascript": "function threeSum(nums) {\n    // Write code here\n}",
                "cpp": "class Solution {\npublic:\n    vector<vector<int>> threeSum(vector<int>& nums) {\n        \n    }\n};"
            }),
            "editorial": "Sort the array. Loop through the array, fixing the first element, then use Two Pointers to find the other two numbers adding to the complement. Skip duplicates. Time: O(N^2), Space: O(log N) or O(N) depending on sort."
        },
        {
            "title": "Search in Rotated Sorted Array",
            "description": "There is an integer array `nums` sorted in ascending order (with distinct values).\n\nPrior to being passed to your function, `nums` is possibly rotated at an unknown pivot index `k`.\n\nGiven the array `nums` after the rotation and an integer `target`, return the index of `target` if it is in `nums`, or `-1` if it is not in `nums`.\n\nYou must write an algorithm with O(log n) runtime complexity.",
            "difficulty": "Medium",
            "tags": "Array, Binary Search",
            "company_tags": "Google, Microsoft, Walmart, Flipkart",
            "time_limit": 1.0,
            "memory_limit": 128,
            "test_cases": json.dumps([
                {"input": "[4,5,6,7,0,1,2]\n0", "output": "4"},
                {"input": "[4,5,6,7,0,1,2]\n3", "output": "-1"},
                {"input": "[1]\n0", "output": "-1"}
            ]),
            "starter_code": json.dumps({
                "python": "def search(nums, target):\n    # Write code here\n    pass",
                "javascript": "function search(nums, target) {\n    // Write code here\n}",
                "cpp": "class Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        \n    }\n};"
            }),
            "editorial": "Modified Binary Search. Find if left or right side is sorted, then check if target lies within the boundaries of the sorted half. Adjust binary search boundaries. Time: O(log N), Space: O(1)."
        },
        {
            "title": "Jump Game",
            "description": "You are given an integer array `nums`. You are initially positioned at the array's first index, and each element in the array represents your maximum jump length at that position.\n\nReturn `true` if you can reach the last index, or `false` otherwise.",
            "difficulty": "Medium",
            "tags": "Array, Dynamic Programming, Greedy",
            "company_tags": "Amazon, Goldman Sachs, Microsoft",
            "time_limit": 1.0,
            "memory_limit": 128,
            "test_cases": json.dumps([
                {"input": "[2,3,1,1,4]", "output": "true"},
                {"input": "[3,2,1,0,4]", "output": "false"}
            ]),
            "starter_code": json.dumps({
                "python": "def canJump(nums):\n    # Write code here\n    pass",
                "javascript": "function canJump(nums) {\n    // Write code here\n}",
                "cpp": "class Solution {\npublic:\n    bool canJump(vector<int>& nums) {\n        \n    }\n};"
            }),
            "editorial": "Greedy approach. Keep track of the furthest index we can reach. If we can reach or pass the final index, return true. If current index exceeds furthest reach, return false. Time: O(N), Space: O(1)."
        },
        {
            "title": "Merge Intervals",
            "description": "Given an array of `intervals` where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.",
            "difficulty": "Medium",
            "tags": "Array, Sorting",
            "company_tags": "Meta, Google, Walmart",
            "time_limit": 1.0,
            "memory_limit": 128,
            "test_cases": json.dumps([
                {"input": "[[1,3],[2,6],[8,10],[15,18]]", "output": "[[1,6],[8,10],[15,18]]"},
                {"input": "[[1,4],[4,5]]", "output": "[[1,5]]"}
            ]),
            "starter_code": json.dumps({
                "python": "def merge(intervals):\n    # Write code here\n    pass",
                "javascript": "function merge(intervals) {\n    // Write code here\n}",
                "cpp": "class Solution {\npublic:\n    vector<vector<int>> merge(vector<vector<int>>& intervals) {\n        \n    }\n};"
            }),
            "editorial": "Sort intervals by start value. Iterate, adding current interval to merged. If current overlaps with previous in merged, merge them by setting previous end value to max of both ends. Time: O(N log N), Space: O(N)."
        },
        {
            "title": "Median of Two Sorted Arrays",
            "description": "Given two sorted arrays `nums1` and `nums2` of size `m` and `n` respectively, return the median of the two sorted arrays.\n\nThe overall run time complexity should be O(log (m+n)).",
            "difficulty": "Hard",
            "tags": "Array, Binary Search, Divide and Conquer",
            "company_tags": "Google, Goldman Sachs, Microsoft, Meta",
            "time_limit": 1.0,
            "memory_limit": 128,
            "test_cases": json.dumps([
                {"input": "[1,3]\n[2]", "output": "2.0"},
                {"input": "[1,2]\n[3,4]", "output": "2.5"}
            ]),
            "starter_code": json.dumps({
                "python": "def findMedianSortedArrays(nums1, nums2):\n    # Write code here\n    pass",
                "javascript": "function findMedianSortedArrays(nums1, nums2) {\n    // Write code here\n}",
                "cpp": "class Solution {\npublic:\n    double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {\n        \n    }\n};"
            }),
            "editorial": "Use binary search to partition both arrays. Partition arrays such that elements on the left side are smaller than elements on the right. Find boundary matches. Time: O(log(min(M, N))), Space: O(1)."
        },
        {
            "title": "Trapping Rain Water",
            "description": "Given `n` non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
            "difficulty": "Hard",
            "tags": "Array, Two Pointers, Dynamic Programming, Stack",
            "company_tags": "Google, Amazon, Microsoft, Adobe",
            "time_limit": 1.0,
            "memory_limit": 128,
            "test_cases": json.dumps([
                {"input": "[0,1,0,2,1,0,1,3,2,1,2,1]", "output": "6"},
                {"input": "[4,2,0,3,2,5]", "output": "9"}
            ]),
            "starter_code": json.dumps({
                "python": "def trap(height):\n    # Write code here\n    pass",
                "javascript": "function trap(height) {\n    // Write code here\n}",
                "cpp": "class Solution {\npublic:\n    int trap(vector<int>& height) {\n        \n    }\n};"
            }),
            "editorial": "Use two pointers, left and right. Keep track of leftMax and rightMax. Traverse, updating max values, and add difference between current height and max values to total trapped water. Time: O(N), Space: O(1)."
        },
        {
            "title": "Edit Distance",
            "description": "Given two strings `word1` and `word2`, return the minimum number of operations required to convert `word1` to `word2`.\n\nYou have the following three operations permitted on a word:\n1. Insert a character\n2. Delete a character\n3. Replace a character",
            "difficulty": "Hard",
            "tags": "String, Dynamic Programming",
            "company_tags": "Google, Microsoft, Amazon",
            "time_limit": 1.0,
            "memory_limit": 128,
            "test_cases": json.dumps([
                {"input": "\"horse\"\n\"ros\"", "output": "3"},
                {"input": "\"intention\"\n\"execution\"", "output": "5"}
            ]),
            "starter_code": json.dumps({
                "python": "def minDistance(word1, word2):\n    # Write code here\n    pass",
                "javascript": "function minDistance(word1, word2) {\n    // Write code here\n}",
                "cpp": "class Solution {\npublic:\n    int minDistance(string word1, string word2) {\n        \n    }\n};"
            }),
            "editorial": "Use Dynamic Programming. Define a 2D table dp[i][j] representing minimum operations to convert word1[0...i-1] to word2[0...j-1]. Fill table iteratively. Time: O(M * N), Space: O(M * N)."
        }
    ]

    for p in problems_data:
        db_problem = Problem(
            title=p["title"],
            description=p["description"],
            difficulty=p["difficulty"],
            tags=p["tags"],
            company_tags=p["company_tags"],
            time_limit=p["time_limit"],
            memory_limit=p["memory_limit"],
            test_cases=p["test_cases"],
            starter_code=p["starter_code"],
            editorial=p["editorial"]
        )
        db.add(db_problem)
    
    db.commit()

    # Seed a Mock Contest
    now = datetime.now()
    contest = Contest(
        title="Weekly Challenge 1",
        description="Solve 3 algorithmic challenges to improve your DSA rank. Earn bonus XP and coins!",
        start_time=now - timedelta(hours=1),
        end_time=now + timedelta(days=6),
        duration_minutes=90,
        problem_ids="1,2,6"  # Two Sum, Valid Parentheses, Longest Substring
    )
    db.add(contest)
    db.commit()
