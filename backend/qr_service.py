import os
import io
import uuid
import socket
import base64
import qrcode
from PIL import Image


def get_lan_ip() -> str:
    """
    Determine the best reachable LAN IP for other devices on the same Wi-Fi.
    Checks LOCAL_IP from environment first, then detects via socket connection.
    """
    env_ip = os.getenv("LOCAL_IP")
    if env_ip and env_ip.strip() and env_ip != "localhost" and env_ip != "127.0.0.1":
        return env_ip.strip()

    try:
        # Connect a UDP socket to an external address to find which network interface has internet/LAN route
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        if ip and ip != "127.0.0.1":
            return ip
    except Exception:
        pass

    return "192.168.1.42"


def generate_tag_id() -> str:
    """Generates a short, memorable tag ID like TAG-9A4B2C."""
    return f"TAG-{uuid.uuid4().hex[:6].upper()}"


def build_scan_url(tag_id: str) -> str:
    """Builds the full HTTP URL that a smartphone will open when scanning the tag."""
    lan_ip = get_lan_ip()
    frontend_port = os.getenv("FRONTEND_PORT", "5173")
    return f"http://{lan_ip}:{frontend_port}/scan?tag_id={tag_id}"


def generate_qr_base64(data_url: str) -> str:
    """
    Generates a high-quality QR code image and returns it as a base64 Data URL.
    """
    qr = qrcode.QRCode(
        version=None,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=10,
        border=3,
    )
    qr.add_data(data_url)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")
    
    # Save to memory buffer
    buffered = io.BytesIO()
    img.save(buffered, format="PNG")
    img_bytes = buffered.getvalue()
    b64 = base64.b64encode(img_bytes).decode("utf-8")
    return f"data:image/png;base64,{b64}"
