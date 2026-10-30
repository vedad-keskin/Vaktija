import { describe, expect, it } from 'vitest';
import { DUAS, type Dua } from './duas.data';
import { createDuaSearch, normalizeDuaQuery } from './duas-search';

const search = createDuaSearch(DUAS);
const ids = (query: string) => search(DUAS, query).map((dua) => dua.id);

function card(id: string, transcription: string, title = 'Heading', translation = 'Meaning'): Dua {
  return {
    id, title: { bs: title, en: title }, arabic: '',
    transcription: { bs: transcription, en: transcription },
    translation: { bs: translation, en: translation },
    reference: { bs: '', en: '' }, sourceUrl: '',
  };
}

describe('dua search', () => {
  it('searches actual titles, meanings, nested sayings and both languages', () => {
    for (const query of ['toalet', 'prizivam', 'euzu', 'bathroom', 'evil ones']) {
      expect(ids(query), query).toContain('hisn-10');
    }
    for (const query of ['Estagfirullāh', 'Astaghfirullāh', 'forgiveness']) {
      expect(ids(query), query).toContain('hisn-66');
      expect(ids(query).filter((id) => id === 'hisn-66')).toHaveLength(1);
    }
    expect(ids('toalet euzu')).toContain('hisn-10');
    expect(ids('euzu toalet')).toEqual(ids('toalet euzu'));
    expect(ids('toalet nonexistentword')).toEqual([]);
  });

  it('composes every soft-letter alternative inside words and compact phrases', () => {
    for (const query of [
      'E‘ūḏu', 'E‘ūḏu'.normalize('NFD'), 'EUZU', 'eudu', 'eudhu',
      'hubti', 'hubsi', 'hubthi', 'khubti', 'khubsi', 'khubthi',
      'euzu hubti', 'eudubikeminelhubsi',
    ]) expect(ids(query), query).toContain('hisn-10');
    expect(ids('dallezi')).toContain('hisn-66');
    for (const query of ['katir', 'kasir', 'kathir', 'ketir', 'kesir', 'kethir']) {
      expect(ids(query), query).toContain('hisn-194');
    }
    expect(ids('mesihidedzal')).toContain('hisn-199');
    expect(ids('elhamdulillah')).toContain('hisn-188');
    expect(ids('el hamdu lillah')).toContain('hisn-188');
  });

  it('accepts the supported alternatives in both directions', () => {
    for (const [a, b] of [
      ['vahdehu', 'wahdehu'], ['qadir', 'kadir'], ['ḏāli', 'zaali'], ['ḏuku', 'dhuku'],
      ['ṯevbe', 'sevbe'], ['ṯevbe', 'tevbe'], ['halfi', 'khalfi'], ['ḫalfī', 'halfi'],
      ['gufran', 'ghufran'], ['šejtan', 'shejtan'], ['sejtan', 'šejtan'],
      ['Allāh', 'Alah'], ['Allah', 'Allaah'], ['Allāhumme', 'al-lahume'],
      ['rabbi', 'rabi'], ['qadiir', 'qadir'], ['nuur', 'nur'], ['innee', 'inni'],
      ['noor', 'nūr'], ['dedždžāli', 'dedzali'], ['ḍāli', 'daali'], ['ṭāli', 'taali'],
      ['ṣāli', 'saali'], ['ẓāli', 'zaali'], ['ḥāli', 'haali'],
    ]) {
      const collection = [card('a', a), card('b', b)];
      const find = createDuaSearch(collection);
      expect(find(collection, a).map((dua) => dua.id), `${a} → ${b}`).toContain('b');
      expect(find(collection, b).map((dua) => dua.id), `${b} → ${a}`).toContain('a');
    }
  });

  it('keeps ordinary letters and meanings distinct from transcription aliases', () => {
    for (const [a, b] of [
      ['daru', 'zaru'], ['taru', 'saru'], ['ḍaru', 'zaru'],
      ['jana', 'yana'], ['mala', 'mela'],
    ]) {
      const collection = [card('a', a)];
      expect(createDuaSearch(collection)(collection, b), `${a} ≠ ${b}`).toEqual([]);
    }
    for (const [text, query] of [
      ['wahdehu', 'vahdehu'], ['qadir', 'kadir'], ['ghufran', 'gufran'],
      ['ḏaru', 'zaru'], ['ṯaru', 'saru'], ['shejtan', 'sejtan'],
      ['makhluq', 'mahluq'], ['rabbi', 'rabi'], ['noor', 'nur'], ['innee', 'inni'],
    ]) {
      const collection = [card('a', '', text, text)];
      expect(createDuaSearch(collection)(collection, query), `${text} ≠ ${query}`).toEqual([]);
    }
    const collection = [card('a', 'kaa vee')];
    expect(createDuaSearch(collection)(collection, 'q')).toEqual([]);
    expect(createDuaSearch(collection)(collection, 'we')).toEqual([]);
  });

  it('keeps compact matching within one field, language and saying', () => {
    const collection: Dua[] = [{
      id: 'boundaries', title: { bs: 'titlepart', en: 'other' },
      sayings: [
        { arabic: '', transcription: { bs: 'alfa', en: 'beta' }, translation: { bs: 'meaningpart', en: '' } },
        { arabic: '', transcription: { bs: 'gama', en: 'delta' }, translation: { bs: '', en: '' } },
      ],
    }];
    const find = createDuaSearch(collection);
    for (const query of ['alfabeta', 'alfagama', 'titlepartmeaningpart']) {
      expect(find(collection, query), query).toEqual([]);
    }
    expect(find(collection, 'alfa gama')).toEqual(collection);
  });

  it('ranks titles, ordinary matches and relaxed matches with stable scope ordering', () => {
    const collection = [card('relaxed', 'ṯevbe'), card('meaning', '', 'Other', 'sevbe'), card('title', '', 'sevbe')];
    const find = createDuaSearch(collection);
    expect(find(collection, 'sevbe').map((dua) => dua.id)).toEqual(['title', 'meaning', 'relaxed']);
    expect(find([collection[1], collection[0]], 'sevbe').map((dua) => dua.id)).toEqual(['meaning', 'relaxed']);
    const scope = [collection[2], collection[0]];
    for (const query of ['', '  ', '‘’`ʿʾ', '[.*+?^${}()|\\]']) expect(find(scope, query)).toBe(scope);
    expect(normalizeDuaQuery('  ĐŽĀMIJA… ČĆŠŽ  ')).toBe('djzamija ccsz');
    expect(ids('[euzu]')).toContain('hisn-10');
    expect(ids('euzu.*nonexistentword')).toEqual([]);
  });
});
