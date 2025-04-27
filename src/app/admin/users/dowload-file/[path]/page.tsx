export default async function DownloadFilePage({
    params,
}: {
    params: Promise<{ path: string }>
}) {
    const { path } = await params;
    return <div>Download File {path}</div>;
}