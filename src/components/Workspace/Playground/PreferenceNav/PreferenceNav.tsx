type PreferenceNavProps = {
	handleSubmit: () => void;
	language: string;
    setLanguage: React.Dispatch<React.SetStateAction<string>>;
};

const PreferenceNav: React.FC<PreferenceNavProps> = ({ handleSubmit,language,setLanguage }) => {

    const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setLanguage(event.target.value);
    };
	return (
		<div className='flex items-center justify-between bg-dark-layer-2 h-11 w-full px-4'>
			<div className='flex items-center text-white'>
				<select
                    className='flex cursor-pointer items-center rounded focus:outline-none bg-dark-fill-3 text-dark-label-2 hover:bg-dark-fill-2 px-2 py-1.5 font-medium'
                    value={language}
                    onChange={handleLanguageChange}
                >
                    <option value="cpp">C++</option>
                    <option value="java">Java</option>
                    <option value="python">Python</option>
                    <option value="javascript">JavaScript</option>
                </select>
			</div>
			<div className=" flex gap-2">
			<button
            className="px-3 py-1.5 text-sm font-medium items-center whitespace-nowrap transition-all focus:outline-none inline-flex bg-dark-fill-3  hover:bg-dark-fill-2 text-dark-label-2 rounded-lg"
            onClick={handleSubmit}
          >
            Run
          </button>
          <button
            className="px-3 py-1.5 font-medium items-center transition-all focus:outline-none inline-flex text-sm text-white bg-dark-green-s hover:bg-green-3 rounded-lg"
            onClick={handleSubmit}
          >
            Submit
          </button>
			</div>
		</div>
	);
};
export default PreferenceNav;
