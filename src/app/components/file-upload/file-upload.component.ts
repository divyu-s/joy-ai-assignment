import { Component } from '@angular/core';
import { ROLE } from 'src/app/constants/app-constant';
import { AppUtilService } from 'src/app/services/app-util.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent {
  selectedFile: File | null = null;
  headers: string[] = [];
  parsedData: string[] = [];

  /** Error Cases */
  // Only Admin will report to Root
  adminHierarchyError: any[] = [];
  // Managers can only report to other managers or admin
  managerHierarchyError: any[] = [];
  // Caller can only report to manager
  callerHierarchyError: any[] = [];
  // All users will report to 1 parent user at a time
  userParentError: any[] = [];

  constructor(private utilService: AppUtilService) {}

  /**
   * Method to import csv file
   * @param event
   * @returns
   */
  importCSV(event: Event) {
    const input = event.target as HTMLInputElement;

    if (this.utilService.isEmpty(input.files)) {
      return;
    }

    this.selectedFile = input.files[0];
    this.readCSVFile(this.selectedFile);
  }

  /**
   * Method to read CSV file
   * @param file
   */
  readCSVFile(file: File): void {
    const reader = new FileReader();

    reader.onload = () => {
      const fileContent = reader.result as string;

      // Parse the CSV content
      this.parseCSV(fileContent);
    };

    reader.onerror = () => {
      alert('Could not read the file. Please try again.');
    };

    reader.readAsText(file);
  }

  /**
   * Methos to parse CSV file content
   * @param content
   */
  parseCSV(content: string): void {
    const lines = content.split('\n').map((line) => line.trim());

    // Assuming the first line is the header
    this.headers = lines[0].split(',');

    // Remaining lines are data
    this.parsedData = lines.slice(1);

    this.findErrosInCSV(this.parsedData);
  }

  /**
   * Method to parse data from CSV
   * @param parsedData
   */
  findErrosInCSV(parsedData: string[]) {
    let mappingObj: Map<string, any> = new Map();

    parsedData.forEach((line) => {
      const columnData = line.split(',');
      const obj = {
        fullName: columnData[1],
        role: columnData[2],
      };

      mappingObj.set(columnData[0], obj);
    });

    parsedData.forEach((line, index) => {
      const columnData = line.split(',');

      if (columnData[3].split(';').length > 1) {
        this.userParentError.push({
          row: index + 1,
          email: columnData[0],
          name: columnData[1],
          role: columnData[2],
          reportsTo: columnData[3],
        });
      } else if (
        columnData[2] === ROLE.ADMIN &&
        mappingObj.get(columnData[3])?.role !== ROLE.ROOT
      ) {
        this.adminHierarchyError.push({
          row: index + 1,
          email: columnData[0],
          name: columnData[1],
          role: columnData[2],
          reportsTo: mappingObj.get(columnData[3]),
        });
      } else if (
        columnData[2] === ROLE.MANAGER &&
        mappingObj.get(columnData[3])?.role !== ROLE.ADMIN &&
        mappingObj.get(columnData[3])?.role !== ROLE.MANAGER
      ) {
        this.managerHierarchyError.push({
          row: index + 1,
          email: columnData[0],
          name: columnData[1],
          role: columnData[2],
          reportsTo: mappingObj.get(columnData[3]),
        });
      } else if (
        columnData[2] === ROLE.CALLER &&
        mappingObj.get(columnData[3])?.role !== ROLE.MANAGER
      ) {
        this.callerHierarchyError.push({
          row: index + 1,
          email: columnData[0],
          name: columnData[1],
          role: columnData[2],
          reportsTo: mappingObj.get(columnData[3]),
        });
      }
    });

    console.log(this.userParentError);
    console.log(this.adminHierarchyError);
    console.log(this.managerHierarchyError);
    console.log(this.callerHierarchyError);
  }
}
