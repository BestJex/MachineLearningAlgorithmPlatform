import uuid
import redis
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from rest_framework.response import Response
from rest_framework.views import APIView

from user.models import Account
from utils.naseResponse import BaseResponse
from utils.redisPool import POOL


class LoginView(APIView):
	def post(self, request):
		response = BaseResponse()
		username, password = request.data.get("username", None), request.data.get("password", None)
		user = authenticate(request=request, username=username, password=password)
		if user:
			# 如果验证通过
			login(request, user)
			redisConnect = redis.Redis(connection_pool=POOL)
			try:
				response.code = 200
				token = uuid.uuid4()
				redisConnect.set(str(token), user.id)

				data = {
					"access_token": token,
					"username": user.username,
					"avatar": f"http://127.0.0.1:8000/media/{str(user.avatar)}",
					"message": 'Login Successful!',
				}
				response.data = data
			except Exception as e:
				print(e)
				response.code = 501
				response.error = "Token creation failed!"
		else:
			# 验证失败
			response.code = 501
			response.error = "ERROR Incorrect username or password!"
		return Response(response.dict)


class LogoutView(APIView):
	def get(self, request):
		response = BaseResponse()
		redisConnect = redis.Redis(connection_pool=POOL)
		token = request.META.get("HTTP_AUTHENTICATION", "")
		redisConnect.delete(str(token))
		logout(request)
		response.code = 200
		response.data = "Logout successful!"
		return Response(response.dict)


class RegisterView(APIView):
	def post(self, request):
		response = BaseResponse()
		username, password = request.data.get('username'), request.data.get('password')
		try:
			Account.objects.create_user(username=username, password=password)
			response.code, response.data = 200, 'Register Successful!'
			return Response(response.dict)
		except IntegrityError:
			response.code, response.data = 500, 'Username Already Exists!'
			return Response(response.dict)
