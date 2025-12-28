import strawberry 
from utils.leetcode.queries import Query


schema = strawberry.Schema(query=Query)