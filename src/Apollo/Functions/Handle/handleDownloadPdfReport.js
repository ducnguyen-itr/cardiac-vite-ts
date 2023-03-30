import createClient from '../../apolloClient';
import DOWNLOAD_PDF_REPORT_MUTATIONS from '../../Mutations/downloadPdfReport';

const handleDownloadPdfReport = async ({
  id, studyFid, reportType, reportId, eventFid,
}) => {
  const client = await createClient();
  try {
    const downloadPdfReportResult = await client.mutate({
      mutation: DOWNLOAD_PDF_REPORT_MUTATIONS,
      variables: {
        id,
        studyFid,
        reportType,
        reportId,
        eventFid,
        markAsDownloaded: false,
      },
    });
    const { data } = downloadPdfReportResult;
    const { Bioflux0downloadPdfReport } = data;
    if (!Bioflux0downloadPdfReport?.isSuccess) {
      throw new Error(Bioflux0downloadPdfReport?.message);
    } else {
      return downloadPdfReportResult;
    }
  } catch (error) {
    throw error;
  }
};

export default handleDownloadPdfReport;
