# NEXUS Remote — v0.1.0

NEXUS Remote is the Windows remote-access edition of NEXUS. This folder contains the first deployment foundation using the open-source MeshCentral remote-management server. MeshCentral supplies the actual Windows agent, browser-based remote desktop, keyboard/mouse input, device enrollment, and internet relay. The NEXUS AI Vercel site cannot itself host a persistent remote-control relay.

## Important status

This is **deployment scaffolding, not a live remote-control service yet**. It does not connect to a computer until you deploy a dedicated MeshCentral server, secure its public HTTPS hostname, create an administrator account, and install its official agent on your own Windows PC.

## Why a separate server is required

Vercel serverless functions are not a persistent WebSocket/WebRTC relay. Remote desktop needs a long-running service that can maintain authenticated connections between the Windows host and the browser. Keep this service separate from the NEXUS AI Vercel deployment.

## Deployment outline

1. Choose a domain/subdomain you control, such as `remote.example.com`, and a VPS provider that supports Docker and persistent storage.
2. Point the DNS A/AAAA record to the VPS.
3. Install Docker Engine and the Docker Compose plugin on the VPS.
4. Create a `.env` file containing `NEXUS_REMOTE_HOSTNAME=remote.yourdomain.com` (replace it with your real hostname). Make sure your DNS record points to the VPS.
5. Create the persistent config folder and copy the template: `mkdir data` then `cp config.json data/config.json`. Edit `data/config.json` and replace `remote.example.com` with your real hostname. Keep `NewAccounts` disabled.
6. Allow inbound TCP ports 80 and 443 on the VPS firewall, then start the service with `docker compose up -d`. The Compose file persists MeshCentral's configuration, certificates, and database in `./data`.
7. Open the HTTPS hostname. Create the initial administrator account immediately; MeshCentral documents that the first account becomes the administrator. Enable multi-factor authentication and keep public account registration disabled.
8. In the MeshCentral dashboard, create a device group for your personal Windows computer and download the official Windows agent from that dashboard.
9. Run the agent installer locally on your own PC and approve the Windows security prompts. Confirm the PC appears in your device list.
10. Open the device's Remote Desktop action from the browser dashboard. End the session with Disconnect when finished.

Official documentation:
- MeshCentral container deployment: https://docs.meshcentral.com/install/container/
- MeshCentral quick start and first-admin setup: https://docs.meshcentral.com/install/quickstart/
- MeshCentral configuration reference: https://docs.meshcentral.com/meshcentral/
- Docker Compose: https://docs.docker.com/compose/

## Security checklist

- Use a domain you control and HTTPS with a valid certificate.
- Use a unique administrator password and multi-factor authentication.
- Keep account creation disabled after creating your own account.
- Do not share agent installers, enrollment links, passwords, or pairing codes.
- Install the agent only on computers you own or are explicitly authorized to administer.
- Keep the Windows host visibly enrolled and disconnect remote sessions when done.
- Keep the VPS, MeshCentral image, and operating system patched.
- Back up the persistent data volume securely.
- Never expose VNC/RDP directly to the public internet without a secure gateway.
- Do not use remote access to bypass school, employer, or device-owner restrictions.

## Current limitations

- No NEXUS-branded custom remote-control UI has been wired to the MeshCentral APIs yet.
- No hosted VPS, domain, TLS certificate, or relay has been provisioned by this repository.
- The existing NEXUS AI Vercel deployment is unchanged.
- This starter uses MeshCentral's supported web dashboard for actual remote desktop rather than pretending a static page can control a PC.

Version: 0.1.0
