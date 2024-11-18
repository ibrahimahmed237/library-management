const ReportingService = require("../services/reportingService.js");
const StatisticsService = require("../services/statisticsService.js");
const appError = require("../../../shared/utils/appError.js");

class ReportingController {
  async generateReport(req, res, next) {
    try {
      const { start_date, end_date, report_type } = req.body;

      // Generate the report
      const report = await ReportingService.generateReport({
        start_date,
        end_date,
        report_type,
        borrower_id: !req.borrower.isAdmin ? req.borrower.id : null,
      });

      // Format the date for the filename
      const formattedDate = [
        "last_month_borrowing",
        "last_month_overdue",
      ].includes(report_type)
        ? new Date().toISOString().split("T")[0]
        : new Date(start_date).toISOString().split("T")[0];

      // Set headers for Excel file download
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${report_type}-report-${formattedDate}.xlsx`
      );
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Pragma", "no-cache");

      return res.send(report);
    } catch (error) {
      console.error(`Error generating report: ${error.message}`);
      console.error(error.stack);

      // If it's already an appError, pass it through, otherwise create a new one
      if (error instanceof appError) {
        return next(error);
      }
      return next(
        new appError(error.message || "Error generating report", 400)
      );
    }
  }

  async getStatistics(req, res, next) {
    try {
      const borrowerId = !req.borrower.isAdmin ? req.borrower.id : null;

      // Get statistics
      const stats = await StatisticsService.getStatistics(borrowerId);

      return res.status(200).json({
        status: "success",
        data: stats,
      });
    } catch (error) {
      console.error(`Error getting statistics: ${error.message}`);

      if (error instanceof appError) {
        return next(error);
      }
      return next(
        new appError(error.message || "Error retrieving statistics", 500)
      );
    }
  }
}

module.exports = new ReportingController();
