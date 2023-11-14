class FakeRequest:
    @staticmethod
    def request(method, url):
        return {"id": 1234, "status": "go"}


class AuthorizeClient:
    def __init__(self, token):
        self.token = token

    def send_payment(self, source, target, amount):
        """I havent looked at the API yet, so this is fake"""
        payment_url = f"http://some_site.com/payment/{source}/to/{target}/for/{amount}"
        response = FakeRequest.request("GET", payment_url)
        return response


if __name__ == "__main__":
    x = AuthorizeClient("tokenabc1234")
    g = x.send_payment("root", "root2", 123.45)
    print(g)
