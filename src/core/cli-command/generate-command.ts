import OfferGenerator from '../modules/offer-generator.js';
import TsvFileWriter from '../file-writer/tsv-file-writer.js';
import {CliCommand} from './cli-command.interface.js';
import {MockData} from '../../types/mock-data.type.js';

export default class GenerateCommand implements CliCommand {
  public readonly name = '--generate';
  private initialData!: MockData;

  public async execute(...parameters: string[]): Promise<void> {
    const [count, filepath, url] = parameters;
    const offerCount = Number.parseInt(count, 10);

    try {
      const response = await fetch(url);
      this.initialData = await response.json();
    } catch {
      console.log(`Can't fetch data from ${url}`);
      return;
    }

    const offerGeneratorString = new OfferGenerator(this.initialData);
    const tsvFileWriter = new TsvFileWriter(filepath);

    for (let i = 0; i < offerCount; i++) {
      await tsvFileWriter.write(offerGeneratorString.generate());
    }

    console.log(`File ${filepath} was created`);
  }
}
