# Hetzner Kubernetes Deployment

This directory contains Kubernetes manifests for deploying the IPFS-GCS service on Hetzner Cloud with Hetzner Object Storage.

## Prerequisites

1. **Hetzner Cloud Account** with Kubernetes cluster in Falkenstein (fsn1)
2. **Hetzner Object Storage** bucket created in Falkenstein
3. **Access credentials** for your Hetzner Object Storage

## Quick Deploy

1. **Update credentials** in `secret.yaml`:
   ```bash
   # Base64 encode your credentials
   echo -n "your-access-key-id" | base64
   echo -n "your-secret-access-key" | base64
   ```

2. **Update bucket name** in `configmap.yaml`:
   ```yaml
   bucket-name: "your-bucket-name-fsn1"
   ```

3. **Deploy to cluster**:
   ```bash
   kubectl apply -f k8s/hetzner/
   ```

## Configuration

### Hetzner Object Storage Settings
- **Region**: `eu-central-1` 
- **Endpoint**: `https://fsn1.your-objectstorage.com`
- **Location**: Falkenstein (fsn1)

### Load Balancer Settings
- **Type**: `lb11` (1 IPv4, 1 IPv6)
- **Location**: `fsn1` (Falkenstein)

## Environment-Specific Buckets

For different environments, update the bucket name:
- **Production**: `your-project-ipfs-production-fsn1`
- **Staging**: `your-project-ipfs-staging-fsn1`

## Migration from GCS

To migrate data from Google Cloud Storage:

1. **Deploy with dual support** (set `STORAGE_PROVIDER=gcs` temporarily)
2. **Run data migration script** to copy blocks from GCS to Hetzner
3. **Switch to Hetzner** by updating `STORAGE_PROVIDER=s3`
4. **Verify all data** is accessible from new deployment

## Monitoring

The deployment includes health checks on `/health` endpoint:
- **Liveness probe**: 30s initial delay, 10s interval
- **Readiness probe**: 15s initial delay, 10s interval
- **Resource limits**: 512Mi memory, 200m CPU